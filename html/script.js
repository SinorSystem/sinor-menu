let buttonParams = [];
let currentItems = [];

const openMenu = (data = null) => {
    if (!data || data.length === 0) return;
    currentItems = data;
    $("#grid-container").html("");
    $("#container").show();
    loadItemsOneByOne(data);
};

const loadItemsOneByOne = (data) => {
    data.forEach((item, index) => {
        if (item.hidden) return;
        
        setTimeout(() => {
            const itemHtml = getGridItemRender(
                item.header, 
                item.txt || item.text, 
                index, 
                item.isMenuHeader, 
                item.disabled, 
                item.icon, 
                item.isMenuHeader
            );
            $("#grid-container").append(itemHtml);
            if (!item.isMenuHeader && !item.disabled) {
                $(`#${index}`).click(function() {
                    const target = $(this);
                    postData(target.attr('id'));
                });
            }
            
            if (item.params) buttonParams[index] = item.params;
            
        }, index * 150);
    });
};

const getGridItemRender = (header, message = null, id, isMenuHeader, isDisabled, icon, isFullWidth) => {
    const isFontAwesome = icon && (icon.startsWith('fa-') || icon.startsWith('fas ') || icon.startsWith('far ') || icon.startsWith('fab '));
    const rarityClass = getRarityClass(header);
    
    let iconHtml = '';
    if (icon) {
        if (isFontAwesome) {
            iconHtml = `<i class="${icon}"></i>`;
        } else {
            iconHtml = `<img src="${icon}" alt="${header}" onerror="handleImageError(this)">`;
        }
    } else {
        iconHtml = `<i class="${getDefaultIcon(header)}"></i>`;
    }
    
    const quantity = getQuantity(header);
    const quantityHtml = quantity ? `<div class="item-quantity">${quantity}</div>` : '';
    const fullWidthClass = isFullWidth ? ' full-width' : '';
    
    return `
        <div class="grid-item ${isMenuHeader ? "title" : ""} ${isDisabled ? "disabled" : ""} ${rarityClass}${fullWidthClass}" id="${id}">
            ${quantityHtml}
            <div class="item-icon">
                ${iconHtml}
            </div>
            <div class="item-name">${header}</div>
            ${message ? `<div class="item-description">${message}</div>` : ""}
        </div>
    `;
};

const handleImageError = (img) => {
    img.style.display = 'none';
    const parent = img.parentElement;
    const header = parent.parentElement.querySelector('.item-name').textContent;
    parent.innerHTML = `<i class="${getDefaultIcon(header)}"></i>`;
};

const getRarityClass = (header) => {
    const lowerHeader = header.toLowerCase();
    if (lowerHeader.includes('legendary') || lowerHeader.includes('gold')) return 'item-rarity-legendary';
    if (lowerHeader.includes('epic') || lowerHeader.includes('purple')) return 'item-rarity-epic';
    if (lowerHeader.includes('rare') || lowerHeader.includes('blue')) return 'item-rarity-rare';
    if (lowerHeader.includes('uncommon') || lowerHeader.includes('green')) return 'item-rarity-uncommon';
    return 'item-rarity-common';
};

const getDefaultIcon = (header) => {
    const lowerHeader = header.toLowerCase();
    if (lowerHeader.includes('vehicle') || lowerHeader.includes('car')) return 'fas fa-car';
    if (lowerHeader.includes('weapon') || lowerHeader.includes('gun')) return 'fas fa-gun';
    if (lowerHeader.includes('money') || lowerHeader.includes('cash')) return 'fas fa-money-bill-wave';
    if (lowerHeader.includes('health') || lowerHeader.includes('med')) return 'fas fa-heart';
    if (lowerHeader.includes('armor')) return 'fas fa-shield-alt';
    if (lowerHeader.includes('house') || lowerHeader.includes('home')) return 'fas fa-house';
    if (lowerHeader.includes('phone')) return 'fas fa-mobile-alt';
    if (lowerHeader.includes('food')) return 'fas fa-utensils';
    if (lowerHeader.includes('drink')) return 'fas fa-wine-bottle';
    if (lowerHeader.includes('key')) return 'fas fa-key';
    if (lowerHeader.includes('lockpick')) return 'fas fa-lock-open';
    if (lowerHeader.includes('bandage')) return 'fas fa-band-aid';
    if (lowerHeader.includes('artifact') || lowerHeader.includes('gem')) return 'fas fa-gem';
    return 'fas fa-cube';
};

const getQuantity = (header) => {
    const match = header.match(/\(x(\d+)\)/);
    return match ? match[1] : null;
};

const closeMenu = () => {
    $("#grid-container").html("");
    $("#container").hide();
    buttonParams = [];
    currentItems = [];
};

const postData = (id) => {
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    return closeMenu();
};

const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return closeMenu();
};

window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
            return openMenu(buttons);
        case "CLOSE_MENU":
            return closeMenu();
        default:
            return;
    }
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        cancelMenu();
    }
};

$(document).ready(function() {
    $("#container").hide();
});