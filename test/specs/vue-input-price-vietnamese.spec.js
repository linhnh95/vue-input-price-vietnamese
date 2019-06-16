import Vue from "vue";
import VueInputNumberVietnamese from "../../src/vue-input-price-vietnamese";
import { mount } from "avoriaz";
import {expect} from "chai";

describe('vue-input-price-vietnamese.vue', () => {
    // Inspect the raw component options
    it('no use default display', () => {
        const wrapper = mount(VueInputNumberVietnamese, { propsData: { value: 2000, is_decimal : false }});
        expect(wrapper.data().number).to.equal('2.000')
    })

    it('use default display display', () => {
        const wrapper = mount(VueInputNumberVietnamese, { propsData: { value: '2000,01' }});
        expect(wrapper.data().number).to.equal('2.000,01')
    })

    it('outputs default', () => {
        const component = Vue.extend({
            data: () => ({ total: 1000 }),
            template: '<div><vue-input-price-vietnamese v-model="total"></vue-input-price-vietnamese></div>',
            components: { "vue-input-price-vietnamese" : VueInputNumberVietnamese }
        });

        const wrapper = mount(component);
        expect(wrapper.data().total).to.equal(1000)
    })

    it('outputs default use decimal', () => {
        const component = Vue.extend({
            data: () => ({ total: '1000,01' }),
            template: '<div><vue-input-price-vietnamese v-model="total"></vue-input-price-vietnamese></div>',
            components: { "vue-input-price-vietnamese" : VueInputNumberVietnamese }
        });

        const wrapper = mount(component);
        expect(wrapper.data().total).to.equal('1000,01')
    })

    it('outputs default no use decimal', () => {
        const component = Vue.extend({
            data: () => ({ total: '1000,01' }),
            template: '<div><vue-input-price-vietnamese v-model="total" :is_decimal="false"></vue-input-price-vietnamese></div>',
            components: { "vue-input-price-vietnamese" : VueInputNumberVietnamese }
        });

        const wrapper = mount(component);
        expect(wrapper.data().total).to.equal('1000,01')
    })
});
