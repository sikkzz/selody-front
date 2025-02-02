import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import GroupJoinModal from "@/components/Common/GroupModal/GroupJoinModal/GroupJoinModal";
import GroupFeed from "@/components/Group/GroupFeed/GroupFeed";
import SecretFeed from "@/components/Group/GroupFeed/SecretFeed";
import UploadFeed from "@/components/Group/GroupFeed/UploadFeed";
import GroupManagement from "@/components/Group/GroupManagement/GroupManagement";
import GroupMember from "@/components/Group/GroupMember/GroupMember";
import GroupProfile from "@/components/Group/GroupProfile/GroupProfile";
import GroupTitle from "@/components/Group/GroupTitle/GroupTitle";
import { TAB_KEY, TAB_PARAM } from "@/constants/tabConstants";
import { UI_TYPE } from "@/constants/uiConstants";
import {
	getGroupInfo,
	getGroupMemberList,
} from "@/features/group/group-service";
import { resetGroupStateForGroupPage } from "@/features/group/group-slice";
import { resetPostStateForGroupPage } from "@/features/post/post-slice";
import { openJoinGroupModal } from "@/features/ui/ui-slice";

import { GroupMain, FeedDiv } from "./GroupPage.styles";

const GroupPage = () => {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.auth);
	const { groupInfo, groupMemberList } = useSelector((state) => state.group);

	const { openedModal } = useSelector((state) => state.ui);

	const [isLoading, setIsLoading] = useState(true);
	const [isManaging, setIsManaging] = useState(false);

	const param = useParams();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const groupId = Number(param.id);

	const inviteLink = searchParams.get("invite");

	useEffect(() => {
		dispatch(getGroupMemberList(groupId));

		try {
			dispatch(getGroupInfo(groupId)).unwrap();
			setIsLoading(false);
		} catch (e) {
			navigate(`/community?${TAB_KEY}=${TAB_PARAM.MY_GROUP_FEED}`);
		}

		return () => {
			dispatch(resetPostStateForGroupPage());
			dispatch(resetGroupStateForGroupPage());
		};
	}, []);

	useEffect(() => {
		if (searchParams.get("invite")) {
			groupInfo?.information.memberInfo.some(
				(data) => data.userId !== user.userId && dispatch(openJoinGroupModal()),
			);
		}

		if (searchParams.get("mode")) {
			setIsManaging(true);
		} else {
			setIsManaging(false);
		}
	}, [searchParams]);

	if (isLoading || !groupInfo) {
		return <div>그룹 정보 불러오는 중...</div>;
	}

	const { isPublicGroup } = groupInfo.information.group;
	const leaderId = groupInfo.information.leaderInfo.userId;
	const leaderName = groupInfo.information.leaderInfo.nickname;
	const isGroupLeader = groupInfo.accessLevel === "owner";
	const isGroupMember = groupInfo.accessLevel !== null;

	return (
		<GroupMain>
			<GroupProfile
				groupInfo={groupInfo}
				isGroupLeader={isGroupLeader}
				isGroupMember={isGroupMember}
				isManaging={isManaging}
				groupMemberList={groupMemberList}
			/>

			{isManaging ? (
				<GroupManagement
					groupInfo={groupInfo}
					groupMemberList={groupMemberList}
				/>
			) : (
				<>
					{!isPublicGroup && !isGroupMember ? (
						<SecretFeed />
					) : (
						<FeedDiv>
							{isGroupMember && <UploadFeed />}
							<GroupTitle />
							<GroupFeed groupId={groupId} leaderName={leaderName} />
						</FeedDiv>
					)}

					{isGroupMember && (
						<GroupMember groupId={groupId} leaderId={leaderId} />
					)}

					{openedModal === UI_TYPE.JOIN_GROUP && (
						<GroupJoinModal inviteLink={inviteLink} />
					)}
				</>
			)}
		</GroupMain>
	);
};

export default GroupPage;
