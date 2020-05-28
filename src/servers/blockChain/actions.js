export const newAccAction = ({account, ownerKey, activeKey}) => {
  return [
    {
      actions: [{
        account: 'eosio',
        name: 'newaccount',
        authorization: [{
          actor: 'pogiocreator',
          permission: 'active',
        }],
        data: {
          creator: 'pogiocreator',
          name: account,
          owner: {
            threshold: 1,
            keys: [{
              key: ownerKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
          active: {
            threshold: 1,
            keys: [{
              key: activeKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
        }
      }]
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  ]
}

export const transferAction = ({actor, from, to, quantity}) => {
  return [
    {
      account: 'eosio',
      name: 'transfer',
      authorization: [{
        actor,
        permission: 'active',
      }],
      data: {
        from,
        to,
        quantity,
        memo: '',
      },
    }
  ]
}