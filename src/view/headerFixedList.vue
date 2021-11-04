<template>
	<div ref="list" class="scroll-list">
		<div v-for="item in 5" :key="item">
			<div class="header-wrap">
				<h1>Paragraph {{ item }}</h1>
			</div>
			<div class="list">
				<p v-for="val in 3" :key="val">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident cum quibusdam voluptas
					sapiente qui nulla dolor omnis dolore debitis. Dicta, suscipit quae. Maiores, ex modi
					distinctio impedit beatae explicabo similique!
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent, onMounted, ref } from "@vue/runtime-core";

export default defineComponent({
	setup() {
		const list = ref(null);
		onMounted(() => {
			const scrollList = list.value;
			document.querySelectorAll(".scroll-list .header-wrap").forEach((header, index) => {
				const h1 = header.querySelector("h1");
				header.style.height = `${h1.getBoundingClientRect().height}px`;
				h1.setAttribute("data-top", h1.getBoundingClientRect().top);
				h1.style.zIndex = index + 1;
			});
			if (scrollList) {
				scrollList.addEventListener("scroll", (e) => {
					const h1NodeList = document.querySelectorAll(".scroll-list h1");
					h1NodeList.forEach((item, index) => {
						if (index > 0) {
							const height = item.getBoundingClientRect().height;
							const dataTop = Number(item.getAttribute("data-top"));
							const scrollTop = e.target.scrollTop;
							if (dataTop - scrollTop < height && dataTop - scrollTop > 0) {
								h1NodeList[index - 1].style.transform = `translateY(-${
									height - (dataTop - scrollTop)
								}px)`;
							} else {
								h1NodeList[index - 1].style.transform = `translateY(0px)`;
							}
						}
						if (Number(item.getAttribute("data-top")) <= e.target.scrollTop) {
							item.classList.add("fixed");
						} else {
							item.classList.remove("fixed");
						}
					});
				});
			}
		});

		return {
			list,
		};
	},
});
</script>

<style lang="less" scoped>
.scroll-list {
	width: 100%;
	height: 100vh;
	overflow-y: auto;
}
.header-wrap {
	margin: 0 0 8px;

	h1 {
		background-color: steelblue;
		width: 100%;
		padding: 10px 0;
		margin: 0;
		text-align: center;
		font-size: 24px;
		position: relative;
		&.fixed {
			position: fixed;
			top: 0;
			left: 0;
		}
	}
}
.list {
	padding: 0 10px;
	p {
		margin-bottom: 8px;
	}
}
</style>
