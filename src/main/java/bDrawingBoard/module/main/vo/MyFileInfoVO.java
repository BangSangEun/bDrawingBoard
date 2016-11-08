package bDrawingBoard.module.main.vo;

/**
 * 내 파일 정보 VO
 */
public class MyFileInfoVO {
    private int file_id;
    private String member_id;
    private String file_name;
    private String file_url;
    private String file_data;
    private String regi_date;

    public int getFile_id() {
        return file_id;
    }

    public void setFile_id(int file_id) {
        this.file_id = file_id;
    }

    public String getMember_id() {
        return member_id;
    }

    public void setMember_id(String member_id) {
        this.member_id = member_id;
    }

    public String getFile_name() {
        return file_name;
    }

    public void setFile_name(String file_name) {
        this.file_name = file_name;
    }

    public String getFile_url() {
        return file_url;
    }

    public void setFile_url(String file_url) {
        this.file_url = file_url;
    }

    public String getFile_data() {
        return file_data;
    }

    public void setFile_data(String file_data) {
        this.file_data = file_data;
    }

    public String getRegi_date() {
        return regi_date;
    }

    public void setRegi_date(String regi_date) {
        this.regi_date = regi_date;
    }
}
