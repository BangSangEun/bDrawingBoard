package bDrawingBoard.module.myfile.service;

import bDrawingBoard.module.myfile.vo.MyFileInfoVO;

/**
 * Created by user on 2016-10-16.
 */
public interface MyFileService {

    /**
     * 내 파일 목록 조회
     * @param member_id
     * @return
     */
    public String getFileList(String member_id);

    /**
     * 내 파일 저장
     * @param myFileInfoVO
     * @return
     */
    public String save(MyFileInfoVO myFileInfoVO);

    /**
     * 내 파일 정보 수정
     * @param myFileInfoVO
     * @return
     */
    public String updateMyFileInfo(MyFileInfoVO myFileInfoVO);

    /**
     * 내 파일 삭제
     * @param myFileInfoVO
     * @return
     */
    public String deleteMyFileInfo(MyFileInfoVO myFileInfoVO);
}
