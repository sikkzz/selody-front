import React, { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useTheme } from "styled-components";

import { VIEW_TYPE } from "@/constants/calendarConstants";
import { setCurrentCalenderView } from "@/features/schedule/schedule-slice";

import { CustomCalendarDiv, TitleSelect } from "./CustomCalendar.styles";

// 월이 포함한 주차 갯수 계산하기
const countWeek = (year, month) => {
	const firstOfMonth = new Date(year, month - 1, 1);
	const lastOfMonth = new Date(year, month, 0);

	const datesForCountingWeekNum = firstOfMonth.getDay() + lastOfMonth.getDate();

	return Math.ceil(datesForCountingWeekNum / 7);
};

const getSelectValue = (currentView, currentYear, currentMonth, currentWeek) =>
	currentView === VIEW_TYPE.DAY_GRID_MONTH
		? `${currentYear}-${currentMonth}`
		: `${currentYear}-${currentMonth}-${currentWeek}`;

const getDateOptions = (currentView) => {
	const currentDate = new Date();
	const selectStartDate = new Date(
		currentDate.setMonth(currentDate.getMonth() - 6),
	);
	const yearRange = selectStartDate.getMonth() > currentDate.getMonth() ? 4 : 3;

	const getMonthRange = (year) => {
		return year === selectStartDate.getFullYear()
			? 12 - selectStartDate.getMonth()
			: 12;
	};

	const generateOptionTag = (year, month, week) => {
		const [key, label] = week
			? [`${year}-${month}-${week}`, `${year}년 ${month}월 ${week}주차`]
			: [`${year}-${month}`, `${year}년 ${month}월`];

		return (
			<option key={key} value={key}>
				{label}
			</option>
		);
	};

	const generateOptionTags = (year, month) => {
		if (currentView === VIEW_TYPE.DAY_GRID_MONTH) {
			return generateOptionTag(year, month);
		}

		return Array.from(
			{ length: countWeek(year, month) },
			(_, weekIndex) => weekIndex + 1,
		).map((week) => generateOptionTag(year, month, week));
	};

	const years = Array.from(
		{
			length: yearRange,
		},
		(_, yearIndex) => selectStartDate.getFullYear() + yearIndex,
	);

	const getMonthsForEachYear = (year) =>
		Array.from(
			{
				length: getMonthRange(year),
			},
			(_, monthIndex) =>
				year === selectStartDate.getFullYear()
					? selectStartDate.getMonth() + 1 + monthIndex
					: monthIndex + 1,
		);

	return years.map((year) =>
		getMonthsForEachYear(year).map((month) => generateOptionTags(year, month)),
	);
};

const getTimeFormat = ({ date: { hour } }) => {
	return `${hour < 10 ? `0${hour}` : hour}`;
};

const CustomCalendar = forwardRef(
	(
		{ fullCalendarEvents, handleDateChange, menuHandler = null },
		calendarRef,
	) => {
		const { year, month, week, currentCalendarView } = useSelector(
			(state) => state.schedule,
		);
		const dispatch = useDispatch();

		const theme = useTheme();

		return (
			<CustomCalendarDiv
				data-testid="calendar-container"
				isMonthly={currentCalendarView === VIEW_TYPE.DAY_GRID_MONTH}
			>
				<TitleSelect
					value={getSelectValue(currentCalendarView, year, month, week)}
					isMonthly={currentCalendarView === VIEW_TYPE.DAY_GRID_MONTH}
					onChange={(e) => {
						const [yearValue, monthValue, weekValue] =
							e.target.value.split("-");
						handleDateChange(yearValue, monthValue, weekValue || null);
					}}
				>
					{getDateOptions(currentCalendarView)}
				</TitleSelect>
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					events={fullCalendarEvents}
					headerToolbar={{
						start: "",
						center: "dayGridMonth,timeGridWeek",
						end: "",
					}}
					// views={{
					// 	timeGridWeek: {
					// 		dayHeaderContent: getDayHeaderContentInTimeGridWeek,
					// 	},
					// }}
					buttonText={{
						month: "월별",
						week: "리스트",
					}}
					selectable={true}
					allDaySlot={false}
					locale="ko"
					dayCellContent={(renderInfo) =>
						renderInfo.dayNumberText.replace("일", "")
					}
					height={635}
					eventClick={menuHandler}
					datesSet={({ view: { type } }) =>
						dispatch(setCurrentCalenderView(type))
					}
					slotLabelFormat={getTimeFormat}
					slotDuration="1:00:00"
					eventBackgroundColor={theme.colors.btn_02}
					slotEventOverlap={false}
					eventTextColor={theme.colors.btn_02}
					displayEventTime={false}
					eventDisplay="block"
					eventBorderColor="transparent"
				/>
			</CustomCalendarDiv>
		);
	},
);

export default CustomCalendar;
