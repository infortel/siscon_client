package com.infortel;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.*;

//*************************************************************************************************
public class Convert_Previous_Page_to_new_react {
    private class Item {
        public ObjectNode parent;
        public String key;
        public String value;
        public String toString() {
            return "key="+key+" value="+value;
        }
    }
    //private final static String FILENAME="F:/ori/siscon/web/siscon/src/main/webapp/original/web/pages/app/master/agent/main.pag";
    private final static String FILENAME="F:/a/main";

    ObjectMapper mapper;
    ObjectNode root;
    ObjectNode head;
    ObjectNode body;

    public Convert_Previous_Page_to_new_react() {
        process();
    }
    private void process() {
        try {
            String sourceText=getStringFromFile(FILENAME+".pag");

            XmlMapper xmlMapper = new XmlMapper();
            JsonNode rootNode = xmlMapper.readTree(sourceText);

            mapper =new ObjectMapper();
            root= mapper.createObjectNode();
            head= mapper.createObjectNode();
            body= mapper.createObjectNode();
            root.put("head",head);
            root.put("body",body);

            //Get root nodes.
            JsonNode nodeDocument=rootNode.get("document_properties");
            JsonNode nodeElement=rootNode.get("element");

            //Execute iterations.
            iterateChilds(nodeElement, body,0);

            //Generate result file.
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            String result=mapper.writeValueAsString(root);
            String filename=FILENAME + ".json";
            File file=new File(filename);
            if (file.isFile()) file.delete();
            Path destFilePath = Paths.get(filename);
            Files.writeString(destFilePath, result, StandardOpenOption.CREATE_NEW);
        } catch (Exception e) {
            System.out.println("Error: "+e.getMessage());
        }
    }
    //*************************************************************************************************
    private void iterateChilds(JsonNode sourceParent, ObjectNode destParent, int layer) {
        StringBuffer tab=new StringBuffer();
        for (int i=0; i<layer; i++) tab.append(" -- ");

        String type=sourceParent.get("type").asText();
        processThisType(type,sourceParent,destParent);

        Iterator<Map.Entry<String, JsonNode>> fields = sourceParent.fields();
        while (fields.hasNext()) {

            Map.Entry<String, JsonNode> field = fields.next();
            if (field.getKey().contentEquals("element")) {
                ArrayNode jsonArray=mapper.createArrayNode();
                destParent.put("children",jsonArray);
                if (field.getValue().isArray()) {
                    for (JsonNode node : (ArrayNode) field.getValue()) {
                        ObjectNode destNode=mapper.createObjectNode();
                        jsonArray.add(destNode);
                        iterateChilds(node, destNode,layer + 1);
                    }
                } else {
                    ObjectNode destNode=mapper.createObjectNode();
                    jsonArray.add(destNode);
                    iterateChilds(field.getValue(),destNode, layer+1);
                }
            } /*else {
                Item item=new Item();
                item.parent=destParent;
                item.key=field.getKey();
                item.value=field.getValue().asText();
                addConvertNode(item);
            }*/
        }
    }
    //*************************************************************************************************
    private void processThisType(String type, JsonNode sourceParent,ObjectNode parent) {
        ArrayList<String> takenCare=new ArrayList();
        takenCare.add("element");
        takenCare.add("type");
        if (type.contentEquals("horizontal_panel")) {
            parent.put("type","GPanel");
            parent.put("orientation","row");
        } else if (type.contentEquals("button")) {
            parent.put("type","GButton");
        } else if (type.contentEquals("check_box")) {
            parent.put("type","GCheckbox");
        } else if (type.contentEquals("edit")) {
            parent.put("type","GEdit");
        } else if (type.contentEquals("text_area")) {
            parent.put("type","GText");
        } else if (type.contentEquals("image")) {
            parent.put("type","GImage");
        } else if (type.contentEquals("grid")) {
            parent.put("type","GGrid");
        } else if (type.contentEquals("label")) {
            parent.put("type","GLabel");
        } else if (type.contentEquals("list_box")) {
            parent.put("type","GListbox");
        } else if (type.contentEquals("vertical_panel")) {
            parent.put("type","GPanel");
            parent.put("orientation","column");
        } else if (type.contentEquals("menu_item")) {
            parent.put("type","GMenuitem");
            parent.put("orientation","column");
        } else if (type.contentEquals("tab_panel")) {
            parent.put("type","GTabs");
            parent.put("orientation","column");
        } else if (type.contentEquals("menu_bar")) {
            parent.put("type","GMenutitle");
        } else {
            System.out.println("??? Type not identified: "+type);
        }
        processAllFields(type,sourceParent,parent,takenCare);
    }
    //*************************************************************************************************
    /*??*/
    //*************************************************************************************************
    private void processAllFields(String type, JsonNode sourceParent,ObjectNode parent, ArrayList<String> takenCare) {
        Iterator<Map.Entry<String, JsonNode>> fields = sourceParent.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();
            Item item=new Item();
            item.key=field.getKey();
            item.value=field.getValue().asText();
            item.parent=parent;
            boolean done=takenCare.contains(item.key);

            if (done) item.value=item.value; //Do nothing, already taken care of
            else if (item.key.contentEquals("caption")) do_caption(item);
            else if (item.key.contentEquals("horizontal_menu")) item.parent.put("orientation","row");
            else if (item.key.contentEquals("fields")) do_fields(item);
            else if (item.key.contentEquals("position")) do_pending(item);
            else if (item.key.contentEquals("font_size")) do_pending(item);
            else if (item.key.contentEquals("w")) item.parent.put("width",item.value);
            else if (item.key.contentEquals("selection")) item.parent.put("options",item.value);
            else if (item.key.contentEquals("style")) do_style(item);
            else if (item.key.contentEquals("tablename")) item.parent.put("table",item.value);
            else {
                System.out.println("??? Field not identified: "+item.toString());
            }
        }
    }
    //-------------------------------------------------------------------------------------------------
    private void do_pending(Item item) {

    }
    //-------------------------------------------------------------------------------------------------
    private void do_caption(Item item) {
        if (item.value.contains("[")) item.parent.put("caption","##"+item.value);
        else item.parent.put("caption",item.value);
    }
    //-------------------------------------------------------------------------------------------------
    private void do_fields(Item item) {
        //## ???
    }
    //-------------------------------------------------------------------------------------------------
    private void do_style(Item item) {
        item.parent.put("style","##"+item.value);
    }
    //-------------------------------------------------------------------------------------------------
    private void do_type(Item item) {
        if (item.value.contentEquals("horizontal_panel")) {
            item.parent.put("type","GPanel");
            item.parent.put("orientation","row");
        } else if (item.value.contentEquals("label")) {
            item.parent.put("type","GLabel");
        } else if (item.value.contentEquals("vertical_panel")) {
            item.parent.put("type","GPanel");
            item.parent.put("orientation","column");
        } else if (item.value.contentEquals("menu_item")) {
            item.parent.put("type","GMenuitem");
            item.parent.put("orientation","column");
        } else if (item.value.contentEquals("menu_bar")) {
            item.parent.put("type","GMenutitle");
        } else {
            System.out.println("Value not identified... "+item.toString());
        }
    }
    //*************************************************************************************************
    private String getStringFromFile(String filePath) {
        StringBuilder content = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append(System.lineSeparator());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return content.toString();
    }
    //*************************************************************************************************
}
