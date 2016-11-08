package bDrawingBoard.module.main.dao;

import bDrawingBoard.module.main.vo.MyFileInfoVO;

import java.util.ArrayList;


public interface MyFileDAO {

    /**
     * 내 파일 목록 조회
     * @return
     */
    public ArrayList<MyFileInfoVO> getMyFileInfoList(String member_id);

    /**
     * 내 파일 저장
     * @param myFileInfoVO
     * @return
     */
    public int setMyFileInfo(MyFileInfoVO myFileInfoVO);

    /**
     * 내 파일 수정
     * @param myFileInfoVO
     * @return
     */
    public int updateMyFileInfo(MyFileInfoVO myFileInfoVO);
}
