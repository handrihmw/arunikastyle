<template>
    <div class="block-website__content-paging container" v-if="totalPage > 1">
        <div class="block-website__content-paging-words block-website__content-paging-words--new" v-if="isV2()">Menampilkan {{ totalResource }} dari {{ listWebsite }} tema</div>
        <div class="block-website__content-paging-arrow" v-on:click="prevPage()">
            <img src="/assets/images/2020/membuat-website/paging-icon-left.svg" alt />
        </div>
        <div v-for="(page, index) in totalPage"
          :key="index"
          v-bind:class="{'block-website__content-paging-number--active' : page == currentPage}"
          v-on:click="setPage(page)"
          class="block-website__content-paging-number">
            {{ page }}
        </div>
        <div class="block-website__content-paging-arrow" v-on:click="nextPage()">
            <img src="/assets/images/2020/membuat-website/paging-icon-right.svg" alt />
        </div>
    </div>
</template>

<script>
export default {
    name: "PaginationDiyList",
    methods: {
        isV2() {
            if (window.location.pathname.includes("/v2/")) {
                return false;
            }
            return true;
        },
        setPage(page) {
            this.$emit("pagination", {
                totalPage: this.totalPage,
                currentPage: page,
                totalResource: this.setTotalResource(page)
            });
        },
        setTotalResource(page) {
          let totalResource = this.listWebsite - ((page - 1) * 9);
          return totalResource > 9 ? 9 : totalResource;
        },
        prevPage() {
            let page = this.currentPage - 1;

            if (!page) {
                return true;
            }

            this.setPage(page);
        },
        nextPage() {
            let page = this.currentPage + 1;

            if (page > this.totalPage) {
                return true;
            }

            this.setPage(page);
        }
    },
    props: ["currentPage", "totalPage", "totalResource", "listWebsite"]
};
</script>