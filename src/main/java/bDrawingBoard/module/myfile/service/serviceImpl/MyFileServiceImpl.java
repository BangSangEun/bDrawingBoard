package bDrawingBoard.module.myfile.service.serviceImpl;

import bDrawingBoard.module.myfile.dao.MyFileDAO;
import bDrawingBoard.module.myfile.service.MyFileService;
import bDrawingBoard.module.myfile.vo.MyFileInfoVO;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.util.ArrayList;

/**
 * Created by user on 2016-10-16.
 */
@Service
public class MyFileServiceImpl implements MyFileService {
    @Autowired
    MyFileDAO myFileDAO;

    public String getFileList(String member_id) {
        JSONObject resultObj = new JSONObject();
        JSONArray tempArray = new JSONArray();

        try {
            ArrayList<MyFileInfoVO> myFileInfoList = myFileDAO.getFileList(member_id);

            for(int i=0; i<myFileInfoList.size(); i++) {
                JSONObject tempObj = new JSONObject();
                tempObj.put("file_id", myFileInfoList.get(i).getFile_id());
                tempObj.put("member_id", myFileInfoList.get(i).getMember_id());
                tempObj.put("file_name", URLEncoder.encode(myFileInfoList.get(i).getFile_name(), "UTF-8"));
                tempObj.put("file_data", myFileInfoList.get(i).getFile_data());
                tempObj.put("regi_date", myFileInfoList.get(i).getRegi_date());

                tempArray.put(tempObj);
            }

            resultObj.put("myFileInfoList", tempArray);
        }catch (Exception e) {
            e.printStackTrace();
        }

        return resultObj.toString();
    }

    public String save(MyFileInfoVO myFileInfoVO) {
        String result = "success";
        int myfileSave = myFileDAO.save(myFileInfoVO);  //내 파일 저장

        if(myfileSave != 1) {
            result = "fail";
        }

        return result;
    }

    public String updateMyFileInfo(MyFileInfoVO myFileInfoVO) {
        String result = "success";
        int myfileUpdate = myFileDAO.updateMyFileInfo(myFileInfoVO);

        if(myfileUpdate != 1) {
            result = "fail";
        }

        return result;
    }

    public String deleteMyFileInfo(MyFileInfoVO myFileInfoVO) {
        String result = "success";
        int myfileUpdate = myFileDAO.deleteMyFileInfo(myFileInfoVO);

        if(myfileUpdate != 1) {
            result = "fail";
        }

        return result;
    }
}
