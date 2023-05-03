class CartDrawer extends HTMLElement {
    constructor() {
        super();

        document.getElementById('CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
        this.querySelector('.js-cart-drawer-close').addEventListener('click', this.close.bind(this));
        this.setHeaderCartIconAccessibility();
    }
    setHeaderCartIconAccessibility() {
        const cartLink = document.getElementById('basketIcon');
        cartLink.addEventListener('click', (event) => {
            event.preventDefault();
            this.open()
        });
    }
    open() {
        this.classList.remove('translate-x-full');
        document.getElementById('CartDrawer-Overlay').classList.remove('opacity-0', 'invisible');
        document.body.classList.add('!overflow-hidden');
    }

    close() {
        this.classList.add('translate-x-full');
        document.getElementById('CartDrawer-Overlay').classList.add('opacity-0', 'invisible');
        document.body.classList.remove('!overflow-hidden');
    }

    renderContents(parsedState) {
        this.querySelector('.drawer__inner').classList.contains('is-empty') && this.querySelector('.drawer__inner').classList.remove('is-empty');
        this.productId = parsedState.id;
        this.getSectionsToRender().forEach((section => {
            const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
            sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
        }));

        setTimeout(() => {
            document.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
            this.querySelector('.js-cart-drawer-close').addEventListener('click', this.close.bind(this));
            this.open();
        });
    }

    getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
    }

    getSectionsToRender() {
        return [
            {
                id: 'cart-drawer',
                selector: '#CartDrawer'
            },
            {
                id: 'cart-icon-bubble'
            }
        ];
    }

    getSectionDOM(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector);
    }

    setActiveElement(element) {
        this.activeElement = element;
    }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
    getSectionsToRender() {
        return [
            {
                id: 'CartDrawer',
                section: 'cart-drawer',
                selector: '.drawer__inner'
            },
            {
                id: 'cart-icon-bubble',
                section: 'cart-icon-bubble',
                selector: '.shopify-section'
            }
        ];
    }
}

customElements.define('cart-drawer-items', CartDrawerItems);