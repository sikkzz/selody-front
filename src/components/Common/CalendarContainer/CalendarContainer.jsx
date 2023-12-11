import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SCHEDULE_TYPE } from "@/constants/calendarConstants";
import { getSchedulesSummary } from "@/features/schedule/schedule-service";
import {
	resetCurrentDate,
	setCurrentMonth,
	setCurrentWeek,
	setCurrentYear,
} from "@/features/schedule/schedule-slice";
import { getCurrentWeek, getFirstDateOfWeek } from "@/utils/calendarUtils";

import { CalendarContainerDiv } from "./CalendarContainer.styles";
import CustomCalendar from "./CustomCalendar/CustomCalendar";
import InviteUser from "../../SharePage/InviteUser";

const CalendarContainer = ({ type }) => {
	const dispatch = useDispatch();

	const calendarRef = useRef(null);

	const { calendarSchedules } = useSelector((state) => state.schedule);

	const [selectedGroup, setSelectedGroup] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [inviteInput, setInviteInput] = useState("");
	const [invitationLink, setInvitationLink] = useState("");

	const fullCalendarEvents = calendarSchedules.map((schedule) =>
		schedule.recurrence
			? {
					id: schedule.id,
					userId: schedule.userId,
					daysOfWeek: schedule.byweekday,
					startTime: new Date(schedule.startDateTime),
					endDateTime: new Date(schedule.endDateTime),
					startRecur: new Date(schedule.startRecur),
					endRecur: new Date(schedule.until),
			  }
			: {
					id: schedule.id,
					userId: schedule.userId,
					title: schedule.title,
					start: new Date(schedule.startDateTime),
					end: new Date(schedule.endDateTime),
			  },
	);

	const updateDateState = (year, month, week) => {
		dispatch(setCurrentMonth(month));
		dispatch(setCurrentYear(year));
		// 리스트 보기여서 select에서 제공된 주차의 경우
		if (week) {
			return dispatch(setCurrentWeek(week));
		}
		// 월별 보기인데 현재 날짜에 해당하는 년월인 경우
		if (
			new Date().getMonth() + 1 === Number(month) &&
			new Date().getFullYear() === Number(year)
		) {
			return dispatch(setCurrentWeek(getCurrentWeek()));
		}
		// 그 외 모든 월별 보기의 경우
		return dispatch(setCurrentWeek(1));
	};

	const handleDateChange = (year, month, week = null) => {
		const calendarApi = calendarRef.current.getApi();
		if (week) {
			// 리스트(주별) 보기인 경우
			const startDate = getFirstDateOfWeek(year, month, week);
			calendarApi.gotoDate(
				new Date(
					year,
					(startDate > 20 && Number(week) === 1 ? month - 1 : month) - 1,
					startDate,
				),
			);
		} else if (
			!week &&
			new Date().getMonth() + 1 === Number(month) &&
			new Date().getFullYear() === Number(year)
		) {
			// 월별 보기인데, 현재 날짜를 포함한 년월인 경우
			const startDateForToday = getFirstDateOfWeek(
				year,
				month,
				getCurrentWeek(),
			);
			calendarApi.gotoDate(new Date(year, month - 1, startDateForToday));
		} else {
			// 월별 보기에서 그 외 년월인 경우
			calendarApi.gotoDate(new Date(year, month - 1));
		}
		updateDateState(year, month, week);
	};

	const handleDateClick = (info) => {
		const startDate = info.date;
		const endDate = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate() + 1,
		);
		const schdeulesThisDateContained = calendarSchedules.filter((schedule) => {
			return (
				// 아예 양쪽으로 포암하거나(오버랩)
				(schedule.start <= startDate && schedule.end >= endDate) ||
				// 시작이 포함되거나
				(schedule.start >= startDate && schedule.start <= endDate) ||
				// 끝이 포함되거나
				(schedule.end >= startDate && schedule.end <= endDate) ||
				// 그냥 안에 있거나
				(schedule.start >= startDate && schedule.end <= endDate)
			);
		});
		console.log(schdeulesThisDateContained);
	};

	const handleScheduleClick = (clickedInfo) => {
		const { start, end } = clickedInfo.event; // 클릭한 이벤트
		// 오버랩된 이벤트
		const overlappedSchedules = calendarSchedules.filter((schedule) => {
			return (
				schedule.start <= start && // 시작한 날짜가 클릭 이벤트의 시작 날짜 이후
				schedule.end >= end // 시작 날짜가 클릭 이벤트의 끝나는 날짜 이전
			);
		});
		console.log(overlappedSchedules);

		// console.log(schedule[0].id);
		// dispatch(setId(schedule.id));
	};

	const handleInviteButtonClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setInviteInput("");
	};

	const handleSendInvite = () => {
		setAnchorEl(null);
		setInviteInput("");
	};

	// useEffect(() => {
	// 	dispatch(getGroupList());
	// }, [dispatch]);

	useEffect(() => {
		dispatch(getSchedulesSummary({ isGroup: false }));

		return () => dispatch(resetCurrentDate());
	}, []);

	return (
		<CalendarContainerDiv>
			{type === SCHEDULE_TYPE.SHARED && (
				<InviteUser
					selectedGroup={selectedGroup}
					setSelectedGroup={setSelectedGroup}
					handleInviteButtonClick={handleInviteButtonClick}
					anchorEl={anchorEl}
					handleCloseMenu={handleCloseMenu}
					inviteInput={inviteInput}
					setInviteInput={setInviteInput}
					handleSendInvite={handleSendInvite}
					invitationLink={invitationLink}
					setInvitationLink={setInvitationLink}
				/>
			)}
			<CustomCalendar
				ref={calendarRef}
				fullCalendarEvents={fullCalendarEvents}
				handleDateChange={handleDateChange}
				handleDateClick={handleDateClick}
				handleScheduleClick={
					type === SCHEDULE_TYPE.PERSONAL && handleScheduleClick
				}
			/>
		</CalendarContainerDiv>
	);
};

export default CalendarContainer;
