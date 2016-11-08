package bDrawingBoard.module.login.web;

import bDrawingBoard.module.login.service.LoginService;
import bDrawingBoard.module.login.vo.MemberVO;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;

/**
 * Created by user on 2016-09-21.
 */
@Controller
public class LoginController {
    @Autowired
    LoginService loginService;

    @RequestMapping("/login.do")
    public String loginView() {
        return "login";
    }

    /**
     * 로그인 정보 확인
     * @param memberVO
     * @return
     */
    @RequestMapping("/login/memberInfoCheck.do")
    public @ResponseBody String getMemberInfoCheck(@ModelAttribute("memberVO") MemberVO memberVO) {
        String result = "success";

        int checkVal = loginService.getMemberInfoCheck(memberVO);
        if(checkVal < 1) {
            result = "fail";
        }

        return result;
    }

    /**
     * 세션 로그인 정보 조회
     * @param session
     * @return
     */
    @RequestMapping("/login/getMemberInfo.do")
    public @ResponseBody String getMemberInfo(HttpSession session) throws IOException {
        MemberVO memberVO = (MemberVO) session.getAttribute("memberVO");

        JSONObject resultObj = new JSONObject();
        resultObj.put("memberId", memberVO.getMember_id());
        resultObj.put("memberName", URLEncoder.encode(memberVO.getMember_name(), "UTF-8"));
        resultObj.put("memberEmail", memberVO.getMember_email());

        return resultObj.toString();
    }

    /**
     * 로그인
     * @param memberVO
     * @param session
     * @return
     */
    @RequestMapping("/goLogin.do")
    public String loginHandler(@ModelAttribute("memberVO") MemberVO memberVO, HttpSession session) {
        memberVO = loginService.getMemberInfo(memberVO);

        if(memberVO != null) {
            session.setAttribute("memberVO", memberVO);
        }

        return "redirect:/main.do";
    }


    /**
     * 로그아웃
     * @param session
     * @return
     */
    @RequestMapping("/goLogout.do")
    public String logoutHandler(HttpSession session) {
        session.invalidate();

        return "redirect:/";
    }
}
