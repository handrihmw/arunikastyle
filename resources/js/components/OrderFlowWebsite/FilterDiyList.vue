<template>
    <div class="block-website__content-category">
        <div class="block-website__content-category-list">
            <div class="block-website__content-category-list-child"
              v-for="(category, categoryIndex) in categoryList"
              :key="categoryIndex"
              v-bind:class="{'block-website__content-category-list-child--active' : selectedCategory == category}"
              v-on:click="setCategory(category)">
                {{ category }}
            </div>
        </div>
        <div class="block-website__content-category-search">
            <div class="block-website__content-category-search-left">Kategori:</div>
            <div class="block-website__content-category-search-right">
              <input type="text" class="form-control" placeholder="Temukan website favorit anda"
                v-model="search"
                v-on:keyup.enter="searchWebsite()"/>
            </div>
        </div>
        <div class="block-website__content-category-mobile">
            <div class="block-website__content-category-mobile-label">Kategori</div>
            <div class="block-website__content-category-mobile-dropdown">
                <div class="block-website__content-category-mobile-dropdown-selected" v-on:click="openDropdown()">{{ selectedCategory }}</div>
                <ul class="block-website__content-category-mobile-dropdown-list dropdown" v-bind:class="{'d-block' : dropdownStatus}">
                  <li v-for="(category, categoryIndex) in categoryList" :key="categoryIndex" v-on:click="setCategory(category)">
                    <a href="javascript:void(0)">{{ category }}</a>
                  </li>
                </ul>
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
            selectedCategory: "Semua Website",
            search: "",
            dropdownStatus: false
        };
    },
    methods: {
        setCategory(data) {
            this.search = "";
            this.selectedCategory = data;
            this.$emit("category", this.selectedCategory);
            this.dropdownStatus = false;
        },
        searchWebsite() {
            this.selectedCategory = "Semua Website";
            this.$emit("search", this.search);
        },
        openDropdown() {
            this.dropdownStatus = !this.dropdownStatus;
        }
    }
};
</script>