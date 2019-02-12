module.exports = {
  dev: {
    'port': 8080,
    'database': 'mongodb://localhost:27017/pantry_maestro',
    'name': 'Dev - Pantry Maestro',
    'host': 'alpine'
  },
  prod: {
    'port': 8080,
    'database': 'mongodb://localhost:27017/pantry_maestro',
    'name': 'Pantry Maestro',
    'host': 'pantry-maestro'
  }
}
