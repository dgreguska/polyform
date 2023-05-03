class CartNotification extends HTMLElement {
    constructor() {
        super();

        this.notification_modal = new window.bootstrap5.Modal(document.getElementById('cart-notification'), {})
        this.notification = document.getElementById('cart-notification');
        this.onBodyClick = this.handleBodyClick.bind(this);

        this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
        this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
            closeButton.addEventListener('click', this.close.bind(this))
        );
    }

    open() {
        this.notification_modal.show();

        this.notification.addEventListener('transitionend', () => {
            this.notification.focus();
            trapFocus(this.notification);
        }, {once: true});

        document.body.addEventListener('click', this.onBodyClick);
    }

    close() {
        this.notification_modal.hide();

        document.body.removeEventListener('click', this.onBodyClick);

        removeTrapFocus(this.activeElement);
    }

    renderContents(parsedState) {
        this.cartItemKey = parsedState.key;
        this.getSectionsToRender().forEach((section => {
            const el = document.getElementById(section.id);
            el.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);

            if (el.classList.contains('hidden')) el.classList.remove('hidden');
        }));

        this.open();
    }

    getSectionsToRender() {
        return [
            {
                id: 'cart-notification-product',
                selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
            },
            {
                id: 'cart-notification-button'
            },
            {
                id: 'cart-notification-price'
            },
            {
                id: 'cart-icon-bubble'
            },
            {
                id: 'cart-price'
            }
        ];
    }

    getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
    }

    handleBodyClick(evt) {
        const target = evt.target;
        if (target !== this.notification && !target.closest('cart-notification')) {
            const disclosure = target.closest('details-disclosure, header-menu');
            this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
            this.close();
        }
    }

    setActiveElement(element) {
        this.activeElement = element;
    }
}

customElements.define('cart-notification', CartNotification);