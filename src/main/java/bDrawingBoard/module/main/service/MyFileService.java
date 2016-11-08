package bDrawingBoard.module.main.service;

import bDrawingBoard.module.main.vo.MyFileInfoVO;

/**
 * Created by user on 2016-10-16.
 */
public interface MyFileService {

    /**
     * 내 파일 목록 조회
     * @param member_id
     * @return
     */
    public String getMyFileInfoList(String member_id);

    /**
     * 내 파일 저장
     * @param myFileInfoVO
     * @return
     */
    public String setMyFileInfo(MyFileInfoVO myFileInfoVO);

    /**
     * 내 파일 정보 수정
     * @param myFileInfoVO
     * @return
     */
    public String updateMyFileInfo(MyFileInfoVO myFileInfoVO);
}
