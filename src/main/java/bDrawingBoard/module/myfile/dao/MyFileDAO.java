package bDrawingBoard.module.myfile.dao;

import bDrawingBoard.module.myfile.vo.MyFileInfoVO;

import java.util.ArrayList;


public interface MyFileDAO {

    /**
     * 내 파일 목록 조회
     * @return
     */
    public ArrayList<MyFileInfoVO> getFileList(String member_id);

    /**
     * 내 파일 저장
     * @param myFileInfoVO
     * @return
     */
    public int save(MyFileInfoVO myFileInfoVO);

    /**
     * 내 파일 수정
     * @param myFileInfoVO
     * @return
     */
    public int updateMyFileInfo(MyFileInfoVO myFileInfoVO);

    /**
     * 내 파일 삭제
     * @return
     */
    public int deleteMyFileInfo(MyFileInfoVO myFileInfoVO);
}
