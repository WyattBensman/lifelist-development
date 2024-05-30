import dayjs from "dayjs";

function groupShotsByDate(shots) {
  const today = dayjs();
  const yesterday = today.subtract(1, "day");
  const lastWeek = today.subtract(1, "week");

  const groups = {
    Yesterday: [],
    "Within the past week": [],
    Older: {},
  };

  shots.forEach((shot) => {
    const capturedAt = dayjs(shot.capturedAt);

    if (capturedAt.isSame(yesterday, "day")) {
      groups["Yesterday"].push(shot);
    } else if (capturedAt.isAfter(lastWeek)) {
      groups["Within the past week"].push(shot);
    } else {
      const month = capturedAt.format("MMMM YYYY");
      if (!groups["Older"][month]) {
        groups["Older"][month] = [];
      }
      groups["Older"][month].push(shot);
    }
  });

  return groups;
}

export default groupShotsByDate;
