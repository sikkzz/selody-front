import React from "react";
import styled from "styled-components";
import Header from "../components/Header/Header";
import PersonalTodoList from "../components/PersonalTodoList/PersonalTodoList";
import CalendarContainer from "../components/PersonalTodoList/CalendarContainer.jsx";

const MainContainer = styled.main`
	display: flex;
	justify-content: space-between;
	margin: 70px 60px 0px 40px;
	font-family: "Inter", sans-serif;
`;

const PersonalSchedulePage = () => {
	return (
		<>
			<Header />
			<MainContainer>
				<CalendarContainer />
				<PersonalTodoList />
			</MainContainer>
		</>
	);
};

export default PersonalSchedulePage;
