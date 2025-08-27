variable "environments" {
  description = "List of environments to create"
  type        = list(string)
  default     = ["dev", "staging", "prod"]
}

variable "database_configs" {
  description = "Database configurations for each environment"
  type = map(object({
    instance_class = string
    allocated_storage = number
    backup_retention_period = number
  }))
  default = {
    dev = {
      instance_class = "db.t3.micro"
      allocated_storage = 20
      backup_retention_period = 1
    }
    staging = {
      instance_class = "db.t3.small"
      allocated_storage = 50
      backup_retention_period = 7
    }
    prod = {
      instance_class = "db.t3.medium"
      allocated_storage = 100
      backup_retention_period = 30
    }
  }
}

variable "redis_configs" {
  description = "Redis configurations for each environment"
  type = map(object({
    node_type = string
    num_cache_nodes = number
  }))
  default = {
    dev = {
      node_type = "cache.t3.micro"
      num_cache_nodes = 1
    }
    staging = {
      node_type = "cache.t3.small"
      num_cache_nodes = 1
    }
    prod = {
      node_type = "cache.t3.medium"
      num_cache_nodes = 2
    }
  }
}
