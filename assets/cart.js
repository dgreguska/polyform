class CartRemoveButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', (event) => {
            event.preventDefault();
            const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
            cartItems.updateQuantity(this.dataset.index, 0);
        });
    }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
    constructor() {
        super();

        this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

        this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
            .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

        this.debouncedOnChange = debounce((event) => {
            this.onChange(event);
        }, 300);

        this.addEventListener('change', this.debouncedOnChange.bind(this));
    }

    onChange(event) {
        this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
    }

    getSectionsToRender() {
        return [
            {
                id: 'main-cart-items',
                section: document.getElementById('main-cart-items').dataset.id,
                selector: '.js-contents',
            },
            {
                id: 'cart-icon-bubble',
                section: 'cart-icon-bubble',
                selector: '.shopify-section'
            },
            {
                id: 'cart-price',
                section: 'cart-price',
                selector: '.shopify-section'
            },
            {
                id: 'cart-live-region-text',
                section: 'cart-live-region-text',
                selector: '.shopify-section'
            },
            {
                id: 'main-cart-footer',
                section: document.getElementById('main-cart-footer').dataset.id,
                selector: '.js-contents',
            }
        ];
    }

    updateQuantity(line, quantity, name) {
        const loader = document.querySelector('.js-cart-loader[data-loader]');
        window.Global.showLoader(loader);

        const body = JSON.stringify({
            line,
            quantity,
            sections: this.getSectionsToRender().map((section) => section.section),
            sections_url: window.location.pathname
        });

        fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{body}})
            .then((response) => {
                return response.text();
            })
            .then((state) => {
                const parsedState = JSON.parse(state);
                this.classList.toggle('is-empty', parsedState.item_count === 0);
                const cartFooter = document.getElementById('main-cart-footer');

                if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);

                this.getSectionsToRender().forEach((section => {
                    const elementToReplace =
                        document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
                    elementToReplace.innerHTML =
                        this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
                }));

                this.updateLiveRegions(line, parsedState.item_count);
                const lineItem = document.getElementById(`CartItem-${line}`);
                if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
                    lineItem.querySelector(`[name="${name}"]`).focus();
                }
            }).catch(() => {
            const errors = document.getElementById('cart-errors');
            errors.textContent = window.cartStrings.error;
        }).finally(() => {
            window.Global.hideLoader(loader);
        });
    }

    updateLiveRegions(line, itemCount) {
        if (this.currentItemCount === itemCount) {
            const lineItemError = document.getElementById(`Line-item-error-${line}`);
            const quantityElement = document.getElementById(`Quantity-${line}`);

            lineItemError.classList.remove('hidden');
            lineItemError
                .querySelector('.js-cart-item-error-text')
                .innerHTML = window.cartStrings.quantityError.replace(
                '[quantity]',
                quantityElement.value
            );
        }

        this.currentItemCount = itemCount;
        this.lineItemStatusElement.setAttribute('aria-hidden', true);

        const cartStatus = document.getElementById('cart-live-region-text');
        cartStatus.setAttribute('aria-hidden', false);

        setTimeout(() => {
            cartStatus.setAttribute('aria-hidden', true);
        }, 1000);
    }

    getSectionInnerHTML(html, selector) {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
    }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
    customElements.define('cart-note', class CartNote extends HTMLElement {
        constructor() {
            super();

            this.addEventListener('change', debounce((event) => {
                const body = JSON.stringify({note: event.target.value});
                fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{body}});
            }, 300))
        }
    });
}