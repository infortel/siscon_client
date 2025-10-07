package com.infortel;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class Create_Ajax_Constants_In_React_Code {
    public static final String LOCATION_DESTINATION="../siscon_react/src/application/common/system/ajax/$definitions";
    public static final String LOCATION_SOURCE="../../web/siscon/src/main/java/com/siscon/common/client/command";

    public final static String SEPARATE_FOLDER="$";
    //**********************************************************************************************************************
    public Create_Ajax_Constants_In_React_Code() {
        try {
            File fbase = new File(LOCATION_SOURCE);

            System.out.println("Creating ajax command files in react code----------------------> ");
            //Delete previous folder.
            System.out.println("Deleting previous folders: "+LOCATION_DESTINATION);
            int count=this.deleteDirectory(LOCATION_DESTINATION,0);
            System.out.println("Directories and files deleted: "+count);

            File dbase = new File(LOCATION_DESTINATION);
            System.out.println("Creating new file structure");
            dbase.mkdir();
            count=processThisDirectory(fbase, "","",LOCATION_DESTINATION);
            System.out.println("Files created: "+count);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    //**********************************************************************************************************************
    private int processThisDirectory(File fbase, String namePrefix, String destinationCommand, String destinationPath) {
        File[] files=fbase.listFiles();
        int count=0;
        for (File file:files) {
            if (file.isDirectory()) {
                String newFolder=destinationPath+"/"+file.getName();
                File ffolder=new File(newFolder);
                ffolder.mkdir();
                String destCommand=destinationCommand;
                if (destCommand.length()>0) destCommand+=".";
                destCommand+=ffolder.getName();
                count+=processThisDirectory(file,namePrefix+file.getName()+SEPARATE_FOLDER, destCommand,newFolder);
            } else {
                String EXT=".java";
                if (file.getName().endsWith(EXT) && (!file.getName().startsWith("_Directory"))) {
                    String baseName=file.getName().substring(0,file.getName().length()-EXT.length());
                    String name = namePrefix + baseName;
                    processThisFile(file,name, destinationCommand, destinationPath);
                    count++;
                }
            }
        }
        return count;
    }
    //**********************************************************************************************************************
    private void processThisFile(File file, String namePrefix, String destinationCommand, String destinationPath) {
        try {
            StringBuffer destFileContent=new StringBuffer();
            Path filePath = Path.of(file.getAbsolutePath());
            StringBuffer buf = new StringBuffer(Files.readString(filePath));
            //System.out.println(namePrefix);
            while (buf.length()>0) {
                int i=buf.indexOf("\n");
                if (i>=0) {
                    String line=buf.substring(0,i);
                    buf.delete(0,i+1);
                    processThisLine(line, destinationCommand, destFileContent);
                } else {
                    buf.delete(0,buf.length());
                }
            }
            if (!destFileContent.isEmpty()) {

                String filename=file.getName();
                int i=filename.indexOf(".java");
                if (i>0) {
                    filename=SEPARATE_FOLDER+namePrefix;
                    filename=filename.toLowerCase();

                    String content="export class "+filename+" {\n"
                            +destFileContent.toString()
                            +"}";

                    Path destFilePath = Paths.get(destinationPath + "/"+filename+".tsx");
                    Files.writeString(destFilePath, content, StandardOpenOption.CREATE_NEW);
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
    //**********************************************************************************************************************
    private void processThisLine(String line, String destinationCommand, StringBuffer destFileContent) {
        line=deleteExtraSpaces(line);
        line=line.replaceAll("= \"","=\"");
        String commandName=extract(line,"String COMMANDNAME=\"","\"");
        if (commandName!=null) {
            destFileContent.append("    static COMMAND:string=\""+destinationCommand+"."+commandName+"\"\n\n");
        } else {
            String name=null;
            String value=null;
            boolean isString=true;
            if (line.indexOf(" I_")>0 || line.indexOf(" O_")>0) {
                name=extract(line," String ","=");
                if (name!=null) {
                    value=extract(line,"\"","\"");
                } else {
                    name=extract(line," int ","=");
                    value=extract(line,"=",";");
                    if (value!=null) value=value.trim();
                    isString=false;
                }
                if (isString) {
                    destFileContent.append("    static "+name+":string=\""+value+"\""+"\n");
                } else {
                    destFileContent.append("    static "+name+":number="+value+"\n");
                }
            }
        }
    }
    //**********************************************************************************************************************
    private String extract(String line, String from, String to) {
        int i1=line.indexOf(from);
        if (i1>=0) {
            int i2 = line.indexOf(to, i1 + from.length());
            if (i2 > i1) {
                return line.substring(i1 + from.length(), i2);
            }
        }
        return null;
    }
    //**********************************************************************************************************************
    private String deleteExtraSpaces(String line) {
        line=line.replaceAll("\t"," ");
        StringBuffer buf=new StringBuffer();
        char lastCh=' ';
        for (int i=0; i<line.length(); i++) {
            char ch = line.charAt(i);
            if (lastCh==' ' && ch==' ') {
                //do nothing
            } else {
                buf.append(""+ch);
            }
            lastCh=ch;
        }
        return(buf.toString());
    }
    //******************************************************************************
    private int deleteDirectory(String directory, int layer) {
        int count=0;
        File sfile=new File(directory);
        File[] files=sfile.listFiles();
        if (files!=null) for (File file:files) {
            if (file.isDirectory()) {
                count+=deleteDirectory(directory+"/"+file.getName(),layer+1);
            } else {
                file.delete();
                count++;
            }
        }
        sfile.delete();
        count++;
        return count;
    }
    //******************************************************************************
}
