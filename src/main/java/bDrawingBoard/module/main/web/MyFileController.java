package bDrawingBoard.module.main.web;

import bDrawingBoard.module.login.vo.MemberVO;
import bDrawingBoard.module.main.service.MyFileService;
import bDrawingBoard.module.main.vo.MyFileInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
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
    @RequestMapping("/getMyFileInfoList.do")
    public @ResponseBody String getMyFileInfoList(HttpSession session) {
        MemberVO memberVO =  (MemberVO)session.getAttribute("memberVO");

        String result = myFileService.getMyFileInfoList(memberVO.getMember_id());

        return result;
    }

    /**
     * 내 파일 저장
     * @param request
     * @param session
     * @return
     */
    @RequestMapping("/setMyFileInfo.do")
    public @ResponseBody String setMyFileInfo(HttpServletRequest request, HttpSession session) {
        MyFileInfoVO myFileInfoVO = new MyFileInfoVO();
        MemberVO memberVO = (MemberVO)session.getAttribute("memberVO");

        myFileInfoVO.setMember_id(memberVO.getMember_id());
        myFileInfoVO.setFile_name(request.getParameter("file_name"));
        myFileInfoVO.setFile_url(request.getParameter("file_url")); //img dataURL
        myFileInfoVO.setFile_data(request.getParameter("file_data")); //array data

        String result = myFileService.setMyFileInfo(myFileInfoVO);
        return result;
    }

    /**
     * 내 파일 정보 수정
     * @param myFileInfoVO
     * @return
     */
    @RequestMapping("/updateMyFileInfo.do")
    public @ResponseBody String updateMyFileInfo(@ModelAttribute("myFileInfoVO") MyFileInfoVO myFileInfoVO) {
        String result = myFileService.updateMyFileInfo(myFileInfoVO);

        return result;
    }
}
