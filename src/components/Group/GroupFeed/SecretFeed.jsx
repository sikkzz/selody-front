import React from "react";

import { SecretIcon } from "@/constants/iconConstants";

import { SecretSection } from "./SecretFeed.styles";

const SecretFeed = () => (
	<SecretSection>
		<SecretIcon />
		<h3>비공개 그룹입니다.</h3>
		<h4>게시물을 확인하려면 그룹 관리자의 수락이 필요해요!</h4>
	</SecretSection>
);

export default SecretFeed;
