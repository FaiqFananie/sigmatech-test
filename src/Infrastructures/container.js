const { createContainer } = require('instances-container')
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const winston = require('./logger')

const User = require('../../models/user')
const Authentication = require('../../models/authentication')
const UserRepository = require('../Domains/users/UserRepository')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const BcryptPasswordHash = require('../Infrastructures/security/BcryptPasswordHash')
const PasswordHash = require('../Applications/security/PasswordHash')
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase')
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase')
const MenuRepository = require('../Domains/menus/MenuRepository')
const MenuRepositoryPostgres = require('./repository/MenuRepositoryPostgres')
const { Menu, Order } = require('../../models/menu_order')
const AddMenuUseCase = require('../Applications/use_case/AddMenuUseCase')
const CheckAuthenticationUseCase = require('../Applications/use_case/CheckAuthenticationUseCase')
const Logger = require('../Applications/debug/Logger')
const WinstonLogger = require('./debug/WinstonLogger')
const GetMenuUseCase = require('../Applications/use_case/GetMenuUseCase')
const GetAllMenuUseCase = require('../Applications/use_case/GetAllMenuUseCase')
const EditMenuUseCase = require('../Applications/use_case/EditMenuUseCase')
const DeleteMenuUseCase = require('../Applications/use_case/DeleteMenuUseCase')
const OrderRepository = require('../Domains/orders/OrderRepository')
const OrderRepositoryPostgres = require('./repository/OrderRepositoryPostgres')
const AddOrderUseCase = require('../Applications/use_case/AddOrderUseCase')
const GetOrderUseCase = require('../Applications/use_case/GetOrderUseCase')
const GetAllOrderUseCase = require('../Applications/use_case/GetAllOrderUseCase')
const EditOrderUseCase = require('../Applications/use_case/EditOrderUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: User
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: Authentication
        }
      ]
    }
  },
  {
    key: MenuRepository.name,
    Class: MenuRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: Menu
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: OrderRepository.name,
    Class: OrderRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          name: 'order',
          concrete: Order
        },
        {
          name: 'menu',
          concrete: Menu
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  },
  {
    key: Logger.name,
    Class: WinstonLogger,
    parameter: {
      dependencies: [
        {
          concrete: winston
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: AddMenuUseCase.name,
    Class: AddMenuUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'menuRepository',
          internal: MenuRepository.name
        }
      ]
    }
  },
  {
    key: CheckAuthenticationUseCase.name,
    Class: CheckAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'userRepository',
          internal: UserRepository.name
        }
      ]
    }
  },
  {
    key: GetMenuUseCase.name,
    Class: GetMenuUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'menuRepository',
          internal: MenuRepository.name
        }
      ]
    }
  },
  {
    key: GetAllMenuUseCase.name,
    Class: GetAllMenuUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'menuRepository',
          internal: MenuRepository.name
        }
      ]
    }
  },
  {
    key: EditMenuUseCase.name,
    Class: EditMenuUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'menuRepository',
          internal: MenuRepository.name
        }
      ]
    }
  },
  {
    key: DeleteMenuUseCase.name,
    Class: DeleteMenuUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'menuRepository',
          internal: MenuRepository.name
        }
      ]
    }
  },
  {
    key: AddOrderUseCase.name,
    Class: AddOrderUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name
        },
        {
          name: 'menuRepository',
          internal: MenuRepository.name
        }
      ]
    }
  },
  {
    key: GetOrderUseCase.name,
    Class: GetOrderUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name
        }
      ]
    }
  },
  {
    key: GetAllOrderUseCase.name,
    Class: GetAllOrderUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name
        }
      ]
    }
  },
  {
    key: EditOrderUseCase.name,
    Class: EditOrderUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'orderRepository',
          internal: OrderRepository.name
        },
        {
          name: 'menuRepository',
          internal: MenuRepository.name
        }
      ]
    }
  }
])

module.exports = container
