export const capitalizeText = (text) => {
    if(!text){
        return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const getOrderStatusBadge = (status) => {
    const statusBadge = status?.toLowerCase();

    if(statusBadge === "delivered"){
        return "badge-success";
    }else if(statusBadge === "shipped"){
        return "badge-info";
    }else if(statusBadge === "pending"){
        return "badge-warning";
    }else{
        return "badge-ghost";
    }
};

export const getStockStatusBadge = (stock) => {
    if(stock === 0){
        return {
            text: "Out of Stock",
            class: "badge-error"
        };
    }

    if(stock < 20){
        return {
            text: "Low Stock",
            class: "badge-warning"
        };
    }

    return {
        text: "In Stock",
        class: "badge-success"
    };
};

export const formatDate = (dateString) => {
    if(!dateString){
        return "";
    }

    const date = new Date(dateString);

    if(isNaN(date.getTime())){
        return "";
    }
    
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};