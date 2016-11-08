package bDrawingBoard.module.login.dao.daoImpl;

import bDrawingBoard.module.login.dao.LoginDAO;
import bDrawingBoard.module.login.vo.MemberVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Created by user on 2016-10-15.
 */
@Repository
public class LoginDAOImpl implements LoginDAO {
    @Autowired
    SqlSessionTemplate sqlSession;

    public int getMemberInfoCheck(MemberVO memberVO) {
        return sqlSession.getMapper(LoginDAO.class).getMemberInfoCheck(memberVO);
    }

    public MemberVO getMemberInfo(MemberVO memberVO) {
        return sqlSession.getMapper(LoginDAO.class).getMemberInfo(memberVO);
    }
}
