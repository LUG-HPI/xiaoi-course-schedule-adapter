function scheduleHtmlParser(result) {

  const courseInfos = parseSchedule(JSON.parse(result))
  console.log(courseInfos)
  return courseInfos
}

function parseSchedule(data) {
    return data.arrangedList.map(item => {
        const weeksMatch = item.weeksAndTeachers.match(/(\d+-\d+周|\d+周)/g);
        const weeks = weeksMatch ? weeksMatch.flatMap(weekRange => {
            if (weekRange.includes('-')) {
                const [start, end] = weekRange.replace('周', '').split('-').map(Number);
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            } else {
                return [parseInt(weekRange.replace('周', ''))]; // 处理单周情况
            }
        }) : [];

        return {
            name: item.courseName, // 课程名称
            position: item.placeName || "", // 上课地点
            teacher: item.weeksAndTeachers.split('/')[1].split('[')[0], // 教师名称
            weeks: weeks, // 周数
            day: item.dayOfWeek, // 星期
            sections: Array.from({ length: item.endSection - item.beginSection + 1 }, (_, i) => item.beginSection + i) // 节次
        };
    });
}