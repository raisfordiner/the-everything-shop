const COLOR_LIST = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#f50', '#1890ff', '#52c41a', '#eb2f96'];

export const getAvatarColor = (name) => {
    if (!name) return '#1890ff';
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
        sum += name.charCodeAt(i);
    }
    const index = sum % COLOR_LIST.length;
    return COLOR_LIST[index];
};

