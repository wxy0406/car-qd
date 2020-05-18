// import { get } from '@/api/dictDetail'

export default {
  data() {
    return {
      dicts: []
    }
  },
  methods: {
    async getDict(name) {
      return new Promise((resolve, reject) => {
        this.dicts = [{
          'id': 1,
          'label': '已租赁',
          'value': 'YES',
          'sort': '1',
          'dictName': null },
        {
          'id': 2,
          'label': '未租赁',
          'value': 'NO',
          'sort': '2',
          'dictName': null }]
        // get(name).then(res => {
        //   this.dicts = res.content
        //   resolve(res)
        // }).catch(err => {
        //   reject(err)
        // })
      })
    }
  }
}
