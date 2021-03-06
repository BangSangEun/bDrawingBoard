package bDrawingBoard.module.myfile.dao.daoImpl;

import bDrawingBoard.module.myfile.dao.MyFileDAO;
import bDrawingBoard.module.myfile.vo.MyFileInfoVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

/**
 * Created by user on 2016-10-16.
 */
@Repository
public class MyFileDAOImpl implements MyFileDAO {
    @Autowired
    SqlSessionTemplate sqlSession;

    public ArrayList<MyFileInfoVO> getFileList(String member_id) {
        return sqlSession.getMapper(MyFileDAO.class).getFileList(member_id);
    }

    public int save(MyFileInfoVO myFileInfoVO) {
        return sqlSession.getMapper(MyFileDAO.class).save(myFileInfoVO);
    }

    public int updateMyFileInfo(MyFileInfoVO myFileInfoVO) {
        return sqlSession.getMapper(MyFileDAO.class).updateMyFileInfo(myFileInfoVO);
    }

    public int deleteMyFileInfo(MyFileInfoVO myFileInfoVO) {
        return sqlSession.getMapper(MyFileDAO.class).deleteMyFileInfo(myFileInfoVO);
    }
}
