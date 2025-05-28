// quy tắc: Không dùng bất kỳ class cụ thể nào trong này cả, phải thông qua key của đối số ngoài tag script.
// mục đích: Dùng cho nhiều trang web đăng ký

function validator(option) {
    // Lấy form-group
    function getParent(elementInput, selector) {
        while (elementInput.parentElement) {
            if (elementInput.parentElement.matches(selector)) {
                return elementInput.parentElement;
            }
            elementInput = elementInput.parentElement;
        }
    }

    var selectorRules = {}; // lưu các rules

    // hàm kiểm tra
    function validate(inputElement, rule) {
        const errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorElement);
        var errorMessage;

        // lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case "radio":
                case "checkbox":
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ":checked"));
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, option.formGroupSelector).classList.add("invalid");
        } else {
            errorElement.innerText = "";
            getParent(inputElement, option.formGroupSelector).classList.remove("invalid");
        }

        return !errorMessage;
    }

    const formElement = document.querySelector(option.form);

    if (formElement) {
        // xứ lý khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // lặp qua từng rule và validate
            option.rules.forEach(function (rule) {
                const inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // trường hợp submit với js
                if (typeof option.onSubmit === "function") {
                    // lấy ra các input có các field là name và không có field disable
                    var formInputs = formElement.querySelectorAll("[name]");

                    var formValues = Array.from(formInputs).reduce(
                        // convert nodelist sang array
                        (values, input) => {
                            switch (input.type) {
                                case "radio":
                                    values[input.name] = formElement.querySelector(
                                        'input[name="' + input.name + '"]:checked'
                                    ).value;
                                    break;
                                case "checkbox":
                                    if (!input.matches(":checked")) {
                                        values[input.name] = "";
                                        return values;
                                    }
                                    if (Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                    break;
                                case "file":
                                    values[input.name] = input.files;
                                    break;
                                default:
                                    values[input.name] = input.value;
                            }

                            return values;
                        },
                        {}
                    );

                    option.onSubmit(formValues);
                } else {
                    // trường hợp submit với hành vi mặc định
                    formElement.submit();
                }
            }
        };

        // lặp qua các rules và xử lý (Lắng nghe sự kiện)
        option.rules.forEach(function (rule) {
            // lưu các rule lại (if else cho các trường hợp có 2 rules trở lên)
            if (Array.isArray(selectorRules[rule.selector])) {
                // nếu là mảng rồi thì push vào
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test]; // gán cho nó là một mảng
            }

            const inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
                // xử lý khi blur ra ngoài
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                };

                // xử lý khi người dùng đang nhập
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(
                        option.errorElement
                    );
                    errorElement.innerText = "";
                    getParent(inputElement, option.formGroupSelector).classList.remove("invalid");
                };
            });
        });
    }
}

validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || "Vui lòng nhập vào trường này";
        },
    };
};

validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Trường này phải là email.";
        },
    };
};

validator.isPhone = function (selector, message) {
    return {
        selector: selector,
        test: function (number) {
            const regex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
            return regex.test(number) ? undefined : message || "Vui lòng nhập đúng định dạng số điện thoại.";
        },
    };
};
