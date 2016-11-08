/**
 * Created by user on 2016-10-12.
 */

/**
 * Member 객체
 * @constructor
 */
define([], function() {
    var Member = function() {
        var _memberId = null,
            _memberPw = null,
            _memberName = null,
            _memberEmail = null;

        this.init = function(memberId, memberPw, memberName, memberEmail) {
            _memberId = memberId;
            _memberPw = memberPw;
            _memberName = memberName;
            _memberEmail = memberEmail;
        };

        this.getMemberId = function() {
            return _memberId;
        };

        this.setMemberId = function(memberId) {
            _memberId = memberId;
        };

        this.getMemberPw = function() {
            return _memberPw;
        };

        this.setMemberPw = function(memberPw) {
            _memberPw = memberPw;
        };

        this.getMemberName = function() {
            return _memberName;
        };

        this.setMemberName = function(memberName) {
            _memberName = memberName;
        };

        this.getMemberEmail = function() {
            return _memberEmail;
        };

        this.setMemberEmail = function(memberEmail) {
            _memberEmail = memberEmail;
        };
    };

    return Member;
});


