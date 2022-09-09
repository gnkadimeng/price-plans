document.addEventListener("alpine:init", () => {
    Alpine.data('price_plan', () => ({

        price_plan : '',
        actions : '',
        totalcost: '',
        sms_price: '',
        call_price: '',
        price_name: '',
        total_sms: 0,
        total_call: 0,
        status: '',

        totalCost() {

            let params = {
                price_plan : this.price_plan,
                actions : this.actions

            }

            axios
                .post('/api/phonebill', params)
                .then((result)=>{
                    //console.log(result)
                    this.totalcost = result.data.total
                })

        
        },

        setPrice() {
            let params = {
                sms_price : this.sms_price,
                call_price : this.call_price,
                price_name : this.price_name

            }

            axios
                .post('/api/price_plan/update', params)
                .then((result) =>{
                    this.status = result.data.status
                })
        },

    }))

    
})