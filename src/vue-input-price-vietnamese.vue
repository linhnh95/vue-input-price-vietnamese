<template>
    <input ref="input"
           :placeholder="placeholder"
           v-bind:value="displayValue(value)"
           v-on:input="updateValue($event.target.value)"
           v-on:keydown="setNumber($event)"
    >
</template>

<script>
    export default {
        props: {
            value: {
                type: [String, Number],
                default: '',
                require : true
            },
            is_decimal : {
                type : Boolean,
                default : true
            },
            placeholder : {
                type : String,
                default : ''
            }
        },
        components: {},
        mounted() {
        },
        watch: {
        },
        data() {
            return {
                number : ""
            };
        },
        methods : {
            /**
             * Khi người dùng nhập giá trị vào input. Giá trị nhập vào sẽ đi qua hàm này để update lại dữ liệu nhập vào.
             *
             * @params String input
             *
             * */
            updateValue: function (value) {
                // Clear các giá trị ngoài số nguyên và dấu phẩy nếu có.
                let cVal = this.clear(value);
                let fVal = "";
                if (this.is_decimal && String(cVal).indexOf(",") > -1) {
                    let dVal = String(cVal).substring(String(cVal).indexOf(",") + 1, String(cVal).length);
                    if(dVal.length > 0){
                        // Format lại dữ liệu trả ra.
                        fVal = this.format(cVal);
                    }else{
                        fVal = cVal;
                    }
                }else{
                    // Format lại dữ liệu trả ra.
                    fVal = this.format(cVal);
                }
                this.number = fVal;
                // Gán lại giá trị đã format vào ô input
                this.$refs.input.value = fVal;
                // Trả lại giá trị đã loại bỏ các kí tự ngoài số nguyên và đấu phẩy
                this.$emit('input', cVal);
            },

            /**
             * Khi có một giá trị được nhập vào input. Giá trị nhập vào sẽ đi qua hàm này để chỉnh lại giá trị hiển thị
             *
             * @params String input
             *
             * @return String after format
             * */
            displayValue: function (value) {
                let fVal = this.format(value);
                this.number = fVal;
                return fVal;
            },

            /**
             * Hàm xử lí 1 chuỗi string nhập vào. Xử lí và biến đổi chuỗi đó thành dãy số được ngăn cách với nhau bằng dấu . mỗi 3 số nguyên.
             * Nếu tồn tại dấu phẩy trong chuỗi string. Hàm sẽ xử lí và làm tròn giá trị nhập vào sau dấu phẩy đến kí tự thứ 2 sau dấu phẩy
             *
             * @params String Input
             *
             * @return String value đã được format
             * */
            format(value) {
                if (value !== "") {
                    // Nếu chuỗi nhập vào chứa dấu phẩy
                    if (this.is_decimal && String(value).indexOf(",") > -1) {
                        let oVal = String(value).substring(0, String(value).indexOf(","));

                        // Giá trị trước dấu phẩy
                        oVal = String(parseFloat(oVal));
                        let dVal = String(value).substring(String(value).indexOf(",") + 1, String(value).length);

                        // Giá trị sau dấu phẩy.
                        // Nếu giá trị trước và sau dấu phẩy đều rỗng. Trả về giá trị rỗng
                        // Nếu giá trị trước dấu phẩy có tồn tại và giá trị sau dấu phẩy là rỗng. Thì trả về giá trị được truyền vào hàm format
                        // Nếu giá trị trước và sau dấu phẩy đều tồn tại. Xử lí dữ liệu rồi trả về chuỗi đã format.
                        if(dVal.length <= 0 && oVal.length <= 0){
                            return "";
                        }else if(oVal.length > 0 && dVal.length <= 0){
                            return value;
                        }else {
                            let oValR = oVal;
                            let dValR = "";

                            // Nếu giá trị thứ 3 sau dấu phẩy lớn hơn hoặc bằng 5. Thì sẽ làm tròn giá trị số thứ 2 sau dấu phẩy.
                            // Nếu không. Chỉ lấy giá trị nhập vào đến số thứ 2 sau dấu phẩy
                            if (parseInt(dVal.charAt(2)) >= 5) {

                                // Nếu số thứ nhất và số thứ 2 sau dấu phẩy đều bằng 9 thì sẽ làm tròn vào số trước dấu phẩy
                                // Nếu không thì cộng thêm 1 vào số thứ 2 sau dấu phẩy
                                if (parseInt(dVal.charAt(1)) >= 9 && parseInt(dVal.charAt(0)) >= 9) {
                                    oValR = parseFloat(oValR) + 1;
                                    dValR = 0;
                                } else {
                                    dValR = parseInt(dVal.substring(0, 2)) + 1;
                                }
                            } else {
                                dValR = dVal.substring(0, 2);
                            }
                            if(isNaN(oValR)){
                                oValR = 0;
                            }
                            // Nếu số đứng trước dấu phẩy là 1 số. Thì format số đứng trước dấu phẩy
                            oValR = oValR.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");

                            let newVal = "";
                            // Nếu số đứng sau dấu phẩy là số. Thì sẽ nối số thứ 1 và số thứ 2 lại với nhau với dấu phẩy ngăn cách
                            if (this.isNumeric(dValR)) {
                                newVal = oValR + "," + dValR;
                            } else {
                                newVal = oValR;
                            }
                            return newVal;
                        }
                    } else {
                        let newVal = "";
                        if(String(value).indexOf(",") > -1){
                            let oVal = String(value).substring(0, String(value).indexOf(","));
                            newVal = String(parseFloat(oVal)).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
                        }else{
                            newVal = String(parseFloat(value)).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.");
                        }
                        return newVal;
                    }
                }
                return "";
            },

            /**
             * Hàm loại bỏ các giá trị ngoài số nguyên và dấu phẩy khi có một chuỗi truyền vào.
             *
             * @params String Input
             *
             * @return String value after clear
             * */
            clear(value) {
                if(value !== "") {
                    // Nếu chuỗi truyền vào chứa dấu phẩy
                    if (this.is_decimal && String(value).indexOf(",") > -1) {
                        let oVal = String(value).substring(0, String(value).indexOf(","));
                        let dVal = String(value).substring(String(value).indexOf(",") + 1, String(value).length);

                        // Nếu giá trị trước và sau dấu phẩy đều rỗng. Trả về giá trị rỗng
                        // Nếu giá trị trước dấu phẩy có tồn tại và giá trị sau dấu phẩy là rỗng. Thì trả về giá trị được truyền vào hàm clart
                        // Nếu giá trị trước và sau dấu phẩy đều tồn tại. Xử lí dữ liệu rồi trả về chuỗi đã clear.
                        if(dVal.length <= 0 && oVal.length <= 0){
                            return "";
                        }else if(oVal.length > 0 && dVal.length <= 0){
                            return value;
                        }else{
                            let oValR = oVal.replace(/[^\d]/g, "");
                            let dValR = dVal.replace(/[^\d]/g, "");

                            // Clear giá trị trước và sau dấu phẩy và nối lại với nhau bằng dấu phẩy.
                            let newValue = oValR + "," + dValR;
                            return newValue;
                        }
                    } else {
                        let newVal = "";
                        if(String(value).indexOf(",") > -1){
                            let oVal = String(value).substring(0, String(value).indexOf(","));
                            newVal = String(oVal).replace(/[^\d]/g, "");
                        }else{
                            newVal = String(value).replace(/[^\d]/g, "");
                        }
                        if(newVal !== ""){
                            return newVal;
                        }else{
                            return "";
                        }
                    }
                }
                return "";
            },

            /**
             * Kiểm tra giá trị có phải là số hay không
             *
             * @params @String|Number value
             *
             * @return Boolean
             * */
            isNumeric(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            },

            /**
             * Hàm xử lí chỉ cho phép giá trị nhập vào là một số phím trên bàn phím
             *
             * @params Event event input
             * */
            setNumber(event) {
                let keyCode = event.keyCode;
                // Nếu component cho phép nhập giá trị decimal. Thì cho phép nhập vào số nguyên, dấu sang trái, dấu sang phải, dấu phẩy, tab, backspace
                // Nếu không chỉ được nhập số nguyên, dấu sang trái, dấu sang phải, tab, backspace
                if(this.is_decimal){
                    if (!((keyCode > 47 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || keyCode == 8 || keyCode == 9 || keyCode == 188 || keyCode == 37 || keyCode == 39)) {
                        event.preventDefault();
                    }
                }else{
                    if (!((keyCode > 47 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || keyCode == 8 || keyCode == 9 || keyCode == 37 || keyCode == 39)) {
                        event.preventDefault();
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
