<template>
    <div class="block-website__filter-group">
        <div v-on:click="setCategory('Semua Website')" v-bind:class="[selectedCategory == 'Semua Website' ? 'block-website__filter-group-item block-website__filter-group-item-active': 'block-website__filter-group-item', 'block-website__filter-group-item']">
          <span class="block-website__filter-group-text">Semua</span>
        </div>
        <div v-for="(category, categoryIndex) in categoryList" :key="categoryIndex" v-on:click="setCategory(category)" v-bind:class="[selectedCategory == category ? 'block-website__filter-group-item block-website__filter-group-item-active': 'block-website__filter-group-item', 'block-website__filter-group-item']">
          <span class="block-website__filter-group-text">{{category}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "FilterDiyList",
    data() {
        return {
            categoryList: [
                "Profil Usaha",
                "Toko",
                "Institusi",
                "Travel",
                "Blog"
            ],
            sortList: [
                "Terbaru",
                "A-Z",
                "Z-A"
            ],
            selectedCategory: "Semua Website",
            selectedSort: "Terbaru",
            search: "",
            dropdownCategoryStatus: false,
            dropdownSortStatus: false
        };
    },
    methods: {
        setCategory(data) {
            this.search = "";
            this.selectedCategory = data;
            this.$emit("category", this.selectedCategory);
            this.dropdownCategoryStatus = false;
        },
        setSort(data) {
            this.search = "";
            this.selectedSort = data;
            this.$emit("sort", this.selectedSort);
            this.dropdownSortStatus = false;
        },
        searchWebsite() {
            this.selectedCategory = "Semua Website";
            this.$emit("search", this.search);
        },
        openDropdownCategory() {
            this.dropdownSortStatus = false;
            this.dropdownCategoryStatus = !this.dropdownCategoryStatus;
        },
        openDropdownSort() {
            this.dropdownCategoryStatus = false;
            this.dropdownSortStatus = !this.dropdownSortStatus;
        }
    }
};
</script>