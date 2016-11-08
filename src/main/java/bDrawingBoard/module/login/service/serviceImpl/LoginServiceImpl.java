package bDrawingBoard.module.login.service.serviceImpl;

import bDrawingBoard.module.login.dao.LoginDAO;
import bDrawingBoard.module.login.service.LoginService;
import bDrawingBoard.module.login.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by user on 2016-10-15.
 */
@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    LoginDAO loginDAO;

    public int getMemberInfoCheck(MemberVO memberVO) {
        return loginDAO.getMemberInfoCheck(memberVO);
    }

    public MemberVO getMemberInfo(MemberVO memberVO) {
        return loginDAO.getMemberInfo(memberVO);
    }
}
