<template>
    <div class="app-container">
        
    </div>
</template>

<script>
import {
    getWarnRoute,
} from "@/api/warn/index";
//引入公共正则
import global_ from '@/utils/Global';
export default {
    name: "InspSiteDirector",
    data() {
        return {
        };
    },
    created() {
        this.getWarnRouteFn();
    },
    beforeDestroy() {
        
    },
    methods: {
        getWarnRouteFn(){
            let searchId = window.location.href.split('?').pop();
            getWarnRoute({ searchId: searchId }).then((res)=>{
                console.log(res,'res.data')
                console.log(res.msg + '?id=' + searchId)
                window.location.href = res.msg + '?id=' + searchId;
                // window.location.href = res.msg + '?id=AlhyYW3m';
            })
        }
    }
};
</script>
<style lang="scss">
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    } 
</style>
