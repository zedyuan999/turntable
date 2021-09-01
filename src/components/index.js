const nextDisance = itemNum.value - ceil(props.list.length / 2);

const tableListNextIndex =
	nextDisance - (itemNum.value - baseIndex) < 0
		? itemNum.value + (nextDisance - (itemNum.value - baseIndex))
		: nextDisance - (itemNum.value - baseIndex);

const listPrevIndex =
	(data.tableList[baseIndex]._baseIndex - (itemNum.value - nextDisance)) % props.list.length < 0
		? props.list.length +
		  ((data.tableList[baseIndex]._baseIndex - (itemNum.value - nextDisance)) % props.list.length)
		: (data.tableList[baseIndex]._baseIndex - (itemNum.value - nextDisance)) % props.list.length;
data.tableList[tableListNextIndex] = props.list[listPrevIndex];

const nextDisance = itemNum.value - Math.ceil(props.list.length / 2);

const tableListNextIndex = (baseIndex + nextDisance) % itemNum.value;

const listPrevIndex =
	(data.tableList[baseIndex]._baseIndex - (itemNum.value - nextDisance)) % props.list.length < 0
		? props.list.length +
		  ((data.tableList[baseIndex]._baseIndex - (itemNum.value - nextDisance)) % props.list.length)
		: (data.tableList[baseIndex]._baseIndex - (itemNum.value - nextDisance)) % props.list.length;
data.tableList[tableListNextIndex] = props.list[listPrevIndex];
