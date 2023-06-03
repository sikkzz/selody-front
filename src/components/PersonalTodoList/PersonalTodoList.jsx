import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleMenuToggle } from "../../features/user/user-slice.js";
import ModalWindow from "./Modal/Modal";
import {
	TodoContainer,
	TodoHeader,
	TodoTabs,
	TodoTab,
	AddEventButton,
	TodoBody,
	TodoTitle,
	TodoSubtitle,
	TodoButton,
	TodoList,
} from "./PersonalTodoList.styles";
import PersonalTodoItem from "./PersonalTodoItem.jsx";

const PersonalTodoList = () => {
	const [selectedTab, setSelectedTab] = useState(false);
	const menuOpen = useSelector((state) => state.user.menuOpen);
	const { schedule } = useSelector((state) => state.schedule);
	const dispatch = useDispatch();

	console.log(schedule);

	const handleMenuOpen = () => {
		dispatch(handleMenuToggle());
	};

	return (
		<>
			<TodoContainer>
				<TodoHeader>
					<TodoTabs>
						<TodoTab
							selected={selectedTab === false}
							onClick={() => setSelectedTab(false)}
						>
							오늘 할 일
						</TodoTab>
						<TodoTab
							selected={selectedTab === true}
							onClick={() => setSelectedTab(true)}
						>
							예정
						</TodoTab>
					</TodoTabs>
				</TodoHeader>
				<TodoBody>
					<TodoTitle>
						오늘의 할 일
						<AddEventButton onClick={handleMenuOpen}>
							<img src="/todo_add.svg" alt="Add-icon" />
							일정추가
						</AddEventButton>
					</TodoTitle>
					<TodoSubtitle>하루동안의 할 일을 관리합니다.</TodoSubtitle>
					{schedule.length === 0 ? (
						<TodoButton onClick={handleMenuOpen}>
							아직 추가된 일정이 없습니다! <br />할 일을 추가하여 하루동안 할
							일을 관리해보세요.
						</TodoButton>
					) : (
						<TodoList>
							{schedule.map((s) => {
								return (
									<PersonalTodoItem
										key={s.startTime + s.endTime}
										schedule={s}
									/>
								);
							})}
						</TodoList>
					)}
				</TodoBody>
			</TodoContainer>
			{menuOpen && <ModalWindow />}
		</>
	);
};

export default PersonalTodoList;
