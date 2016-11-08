package bDrawingBoard.module.login.service;

import bDrawingBoard.module.login.vo.MemberVO;

/**
 * Created by user on 2016-10-15.
 */
public interface LoginService {

    /**
     * 로그인 정보 확인
     * @param memberVO
     * @return
     */
    public int getMemberInfoCheck(MemberVO memberVO);

    /**
     * 회원 정보 조회
     * @param memberVO
     * @return
     */
    public MemberVO getMemberInfo(MemberVO memberVO);
}
