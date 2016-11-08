package bDrawingBoard.module.main.dao.daoImpl;

import bDrawingBoard.module.main.dao.MyFileDAO;
import bDrawingBoard.module.main.vo.MyFileInfoVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by user on 2016-10-16.
 */
@Repository
public class MyFileDAOImpl implements MyFileDAO {
    @Autowired
    SqlSessionTemplate sqlSession;

    public ArrayList<MyFileInfoVO> getMyFileInfoList(String member_id) {
        return sqlSession.getMapper(MyFileDAO.class).getMyFileInfoList(member_id);
    }

    public int setMyFileInfo(MyFileInfoVO myFileInfoVO) {
        return sqlSession.getMapper(MyFileDAO.class).setMyFileInfo(myFileInfoVO);
    }

    public int updateMyFileInfo(MyFileInfoVO myFileInfoVO) {
        return sqlSession.getMapper(MyFileDAO.class).updateMyFileInfo(myFileInfoVO);
    }
}
