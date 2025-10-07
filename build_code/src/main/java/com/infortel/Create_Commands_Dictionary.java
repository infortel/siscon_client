package com.infortel;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Create_Commands_Dictionary {
    public static final String LOCATION_SOURCE="../siscon_react/src";
    public static final String LOCATION_FORM="../../web/siscon/src/main/webapp/original/server/client/react/help/script_functions.json";
    private All all=new All();

    private int directoryCount=0;
    private int fileCount=0;
    //**********************************************************************************************************************
    private class Record {
        public String description;
        public String function;
        public String group;
    }
    private class All {
        public ArrayList<Record> script_functions =new ArrayList();
    }
    //**********************************************************************************************************************
    //**********************************************************************************************************************
    public Create_Commands_Dictionary() {
        try {
            System.out.println("Creating command dictionary---------------------------->");
            File fbase = new File(LOCATION_SOURCE);
            if (fbase.isDirectory()) {
                processThisDirectory(fbase);
                System.out.println("Dictionary processed: directories="+directoryCount+" files="+fileCount);
                saveJsonResult();
            } else {
                System.out.println("Folder not found: "+fbase.getAbsolutePath());
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    //**********************************************************************************************************************
    private void saveJsonResult() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            File file=new File(LOCATION_FORM);
            System.out.println("Saving result in "+file.getAbsolutePath());
            mapper.writerWithDefaultPrettyPrinter().writeValue(file, all);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    //**********************************************************************************************************************
/*
    private void modifyPropertyForm_deprecated() {
        try {

            boolean found=false;
            File file = new File(LOCATION_FORM+".json");
            Path filePath = Path.of(file.getAbsolutePath());
            StringBuffer buf = new StringBuffer(Files.readString(filePath));

            //Make backup.
            if (true) {
                File fileBak = new File(LOCATION_FORM+"_backup.json");
                Path filePathBak = Path.of(fileBak.getAbsolutePath());
                fileBak.delete();
                Files.writeString(filePathBak, buf.toString(), StandardOpenOption.CREATE_NEW);
            }

            int i=buf.indexOf(OPTION_IDENTIFIER);
            if (i>0) {
                int i1=buf.lastIndexOf("\"",i);
                int i2=buf.indexOf("\"",i);
                if (i1>0 && i2>i1) {
                    i1++;
                    buf.delete(i1,i2);
                    buf.insert(i1,OPTION_IDENTIFIER+optionList.toString());
                    Files.writeString(filePath, buf.toString(), StandardOpenOption.WRITE);
                    found=true;
                }
            }
            if (!found)  System.out.println("Could not find options identifier for : "+OPTION_IDENTIFIER);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
 */
    //**********************************************************************************************************************
    private void addRecord(Record record) {
        int index=-1;
        for (int i=0; i<all.script_functions.size(); i++) {
            Record rec=all.script_functions.get(i);
            if (rec.function.compareTo(record.function)>=0) {
                index=i;
                break;
            }
        }
        if (index<0) all.script_functions.add(record);
        else all.script_functions.add(index,record);
    }
    //**********************************************************************************************************************
    private void processThisDirectory(File fbase) {
        File[] files=fbase.listFiles();
        for (File file:files) {
            if (file.isDirectory()) {
                directoryCount++;
                processThisDirectory(file);
            } else {
                if (file.getName().indexOf("Commands")>=0) processThisFile(file);
            }
        }
    }
    //**********************************************************************************************************************
    private void processThisFile(File file) {
        try {
            fileCount++;
            StringBuffer shortPath=new StringBuffer(file.getAbsolutePath().replaceAll("\\\\","/"));
            if (!extract(shortPath,"/application/")) {
                extract(shortPath,"/slibrary/");
            }

            int i=shortPath.indexOf(".");
            if (i>0) shortPath.delete(i,shortPath.length());

            //System.out.println(shortPath.toString());

            Path filePath = Path.of(file.getAbsolutePath());
            StringBuffer buf = new StringBuffer(Files.readString(filePath));
            doDataExtraction(shortPath, buf);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    private boolean extract(StringBuffer buf, String look) {
        int i=buf.indexOf(look);
        if (i>0) {
            buf.delete(0,i + look.length());
            return true;
        }
        return false;
    }
    //******************************************************************************
    private void doDataExtraction(StringBuffer shortPath, StringBuffer buf) {
        while (buf.length()>0) {
            String line=" "+nextStr(buf,"\n");

            int r=line.indexOf("\r"); if (r>=0) line=line.substring(0,r);
            r=line.indexOf("{"); if (r>=0) line=line.substring(0,r);
            r=line.indexOf("):"); if (r>=0) line=line.substring(0,r+1);

            String pub="public";
            r=line.indexOf(pub); if (r>=0) line=line.substring(r+pub.length(),line.length());

            line=line.trim();

            if (line.startsWith("a_") || line.startsWith("b_") || line.startsWith("c_")) {
                if (line.indexOf("(")>0) {

                    String instructions=nextStr(buf,"\n");
                    instructions=instructions.trim();
                    int z=instructions.indexOf("//");
                    if (z==0) {
                        instructions=instructions.substring(z+2,instructions.length()).trim();

                        line=line.replaceAll("=","#");
                        instructions=instructions.replaceAll("=","#");

                        Record rec=new Record();
                        rec.function="app."+line;
                        rec.description=instructions;
                        rec.group=shortPath.toString();
                        addRecord(rec);
                    } else {
                        System.out.println("No instructions given for "+shortPath.toString()+" / "+line);
                    }
                }
            }
        }
    }
    //******************************************************************************
    private String nextStr(StringBuffer buf, String separator) {
        int i=buf.indexOf(separator);
        String result;
        if (i>=0) {
            result=buf.substring(0,i);
            buf.delete(0,i+separator.length());
        } else {
            result=buf.toString();
            buf.delete(0,buf.length());
        }
        return result;
    }
    //******************************************************************************
}
