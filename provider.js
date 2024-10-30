async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    await loadTool('AIScheduleTools'); // 加载工具
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月份从0开始，所以加1
  
    // 根据当前时间计算学年和学期
    const year1 = currentMonth >= 8 ? currentYear : currentYear - 1; // 当前年或前一年
    const year2 = year1 + 1; // 前一年 + 1
    const semester = currentMonth >= 8 ? 1 : 2; // 8月之后为1，之前为2
    
    return fetch("http://jw.new.hbgcjsxy.com/jwapp/sys/kbapp/api/wdkbcx/getMyScheduleDetail.do", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "proxy-connection": "keep-alive",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `XNXQDM=${year1}-${year2}-${semester}&XQDM=`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); 
    })
    .then(async data => {

        if (data.code === "0" && data.datas && data.datas.getMyScheduleDetail) {
            const scheduleDetail = data.datas.getMyScheduleDetail;
            console.log(scheduleDetail); 
            return JSON.stringify(scheduleDetail); 
        } else {
            await AIScheduleAlert(data.msg)
            console.error("No schedule details found or error in response");
            return ""; 
        }
    })
    .catch(async error => {
        await AIScheduleAlert(error.message)
        console.error('There was a problem with the fetch operation:', error);
        return ""; 
    });
}