<template>
    <div class="block-website__filter">
        <div class="block-website__filter-item flex-fill">
          <div class="block-website__filter-label">Urutkan</div>
          <div class="block-website__filter-item-dropdown">
            <div class="block-website__filter-item-dropdown-selected" v-on:click="openDropdownSort()">{{ selectedSort }}</div>
            <ul class="block-website__filter-item-dropdown-list dropdown" v-bind:class="{'d-block' : dropdownSortStatus}">
              <li v-for="(sort, sortIndex) in sortList" :key="sortIndex" v-on:click="setSort(sort)">
                <a href="javascript:void(0)">{{ sort }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="block-website__filter-item flex-fill">
          <div class="block-website__filter-item-dropdown">
            <div class="block-website__filter-item-dropdown-selected" v-on:click="openDropdownCategory()">{{ selectedCategory }}</div>
            <ul class="block-website__filter-item-dropdown-list dropdown" v-bind:class="{'d-block' : dropdownCategoryStatus}">
              <li v-for="(category, categoryIndex) in categoryList" :key="categoryIndex" v-on:click="setCategory(category)">
                <a href="javascript:void(0)">{{ category }}</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="block-website__filter-item flex-fill">
          <div class="block-website__filter-item-search">
            <input type="text" class="form-control" placeholder="Cari Website" 
                v-model="search"
                v-on:keyup="searchWebsite()"/>
          </div>
        </div>
      </div>
</template>

<script>
export default {
    name: "FilterDiyList",
    data() {
        return {
            categoryList: [
                "Semua Website",
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