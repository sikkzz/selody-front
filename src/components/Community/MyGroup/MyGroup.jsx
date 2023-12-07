import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import SampleImg from "@/assets/img/feed/img-group-sample-01.jpeg";
import { inqueryUserGroup } from "@/features/user/user-service";

import { GroupDiv, ListDiv, ItemDiv, CircleDiv } from "./MyGroup.styles";

const MyGroup = () => {
	const dispatch = useDispatch();

	const userGroup = useSelector((state) => state.user.userGroupList);

	useEffect(() => {
		dispatch(inqueryUserGroup());
	}, []);

	return (
		<GroupDiv>
			<h3>내 그룹</h3>
			<ListDiv>
				{userGroup.groupList?.map((info) => (
					<ItemDiv key={info.groupId}>
						<CircleDiv>
							<img src={SampleImg} alt="sampleimg" />
						</CircleDiv>
						<h4>{info.name}</h4>
					</ItemDiv>
				))}
			</ListDiv>
		</GroupDiv>
	);
};

export default MyGroup;
