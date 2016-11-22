package bDrawingBoard.module.myfile.web;

import bDrawingBoard.module.login.vo.MemberVO;
import bDrawingBoard.module.myfile.service.MyFileService;
import bDrawingBoard.module.myfile.vo.MyFileInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by user on 2016-10-16.
 */
@Controller
public class MyFileController {

    @Autowired
    MyFileService myFileService;

    /**
     * 내 파일 목록 조회
     * @param session
     * @return
     */
    @RequestMapping("/getFileList.do")
    public @ResponseBody String getFileList(HttpSession session) {
        MemberVO memberVO =  (MemberVO)session.getAttribute("memberVO");

        String result = myFileService.getFileList(memberVO.getMember_id());

        return result;
    }

    /**
     * 내 파일 저장
     * @param request
     * @param session
     * @return
     */
    @RequestMapping("/save.do")
    public @ResponseBody String save(HttpServletRequest request, HttpSession session) {
        MyFileInfoVO myFileInfoVO = new MyFileInfoVO();
        MemberVO memberVO = (MemberVO)session.getAttribute("memberVO");

        myFileInfoVO.setMember_id(memberVO.getMember_id());
        myFileInfoVO.setFile_name(request.getParameter("file_name"));
        myFileInfoVO.setFile_data(request.getParameter("file_data")); //array data

        String result = myFileService.save(myFileInfoVO);
        return result;
    }

    /**
     * 내 파일 정보 수정
     * @param myFileInfoVO
     * @return
     */
    @RequestMapping("/updateMyFileInfo.do")
    public @ResponseBody String updateMyFileInfo(HttpServletRequest request, HttpSession session) {
        MyFileInfoVO myFileInfoVO = new MyFileInfoVO();
        MemberVO memberVO = (MemberVO)session.getAttribute("memberVO");

        myFileInfoVO.setMember_id(memberVO.getMember_id());
        myFileInfoVO.setFile_id(Integer.parseInt(request.getParameter("file_id")));
        myFileInfoVO.setFile_name(request.getParameter("file_name"));

        String result = myFileService.updateMyFileInfo(myFileInfoVO);

        return result;
    }

    /**
     * 내 파일 삭제
     * @param request
     * @param session
     * @return
     */
    @RequestMapping("/deleteMyFileInfo.do")
    public @ResponseBody String deleteMyFileInfo(HttpServletRequest request, HttpSession session) {
        MyFileInfoVO myFileInfoVO = new MyFileInfoVO();
        MemberVO memberVO = (MemberVO)session.getAttribute("memberVO");

        myFileInfoVO.setMember_id(memberVO.getMember_id());
        myFileInfoVO.setFile_id(Integer.parseInt(request.getParameter("file_id")));

        String result = myFileService.deleteMyFileInfo(myFileInfoVO);

        return result;
    }
}
