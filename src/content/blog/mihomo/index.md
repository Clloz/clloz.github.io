---
title: Mihomo Mac 配置
publishDate: 2025-11-09 22:00:00
description: 'Mihomo 在 Mac 的命令行工具配置'
tags:
  - Markdown
heroImage: { src: './thumbnail.jpg', color: '#B4C6DA' }
language: '中文'
---

## 前言

Mac 上不想要使用 Clash 客户端，大部分都不维护，直接使用 launchd 配置 mihomo 的客户端启动代理，可以自己完全控制代理工具。

## 创建用户

mihomo 毕竟也是一个第三方程序，为了保证安全性还是创建一个独立的用户，用户名称带前置下划线是 mac 默认的系统级用户的通用做法

| 类型              | UID/GID 范围 | 说明                                                                     |
| ----------------- | ------------ | ------------------------------------------------------------------------ |
| 系统保留用户      | 0~399        | macOS 自带系统用户，如 root (0)、\_www、\_spotlight 等；不要使用，会冲突 |
| 服务/守护进程用户 | 400~499      | 推荐范围，用于自建服务用户（隐藏）                                       |
| 普通用户          | 501~         | 正常登录用户，显示在“用户与群组”界面                                     |

```bash
# 判断 UID 是否被占用
dscl . -list /Users UniqueID | grep 450

# 判断 GID 是否被占用
dscl . -list /Groups PrimaryGroupID | grep 450

# 列出所有 UID
dscl . -list /Users UniqueID

# 列出所有 GID
dscl . -list /Groups PrimaryGroupID

# 查看 UID 属于那个分组
id UID

# 创建 group
sudo dscl . -create /Groups/_clash
sudo dscl . -create /Groups/_clash RealName "Clash Service Group"
sudo dscl . -create /Groups/_clash gid 450

# 创建 user
sudo dscl . -create /Users/_clash
sudo dscl . -create /Users/_clash UserShell /usr/bin/false # 禁止该用户登录，使用 shell
sudo dscl . -create /Users/_clash RealName "Clash Service"
sudo dscl . -create /Users/_clash UniqueID 450
sudo dscl . -create /Users/_clash PrimaryGroupID 450
sudo dscl . -create /Users/_clash NFSHomeDirectory /var/empty # 设置家目录路径
sudo dscl . -create /Users/_clash IsHidden 1 # 不在系统设置，用户和分组中展示该分组

# 删除用户
sudo dscl . -delete /Users/_clash

# 可选：删除 home 目录或其他文件
sudo rm -rf /var/empty  # 如果 home 是 /var/empty

# 删除分组 确保没有其他用户使用该分组
sudo dscl . -delete /Groups/_clash
```

## 管理 clash

创建 `/opt/clash` 文件夹用来管理所有 clash 相关的可执行文件，配置和日志，内部创建三个文件夹分别用来管理可执行文件，配置和日志

最新的 mihomo [下载地址](https://github.com/MetaCubeX/mihomo/releases/tag/v1.19.16)，根据 [官方文档](https://wiki.metacubex.one/startup/faq/) MacOS 15 选择 go122 版本

由于 mihomo 是未经第三方验证的程序，mac 默认的 Gatekeeper 默认会禁止我们运行该程序

> Apple could not verify “mihomo-darwin-arm64-go122-v1.19.15” is free of malware that may harm your Mac or compromise your privacy.

遇到这种情况到 System Settings -> Privacy & Security 中滑到最下面点击 run anyway

```bash
# 创建文件夹
sudo mkdir -p /opt/clash/{bin,config,logs}
sudo mkdir /opt/clash/config/ui

# 下载最新版本的 mihomo
curl -L \
  -o mihomo-darwin-arm64-go122-v1.19.16.gz \
  https://github.com/MetaCubeX/mihomo/releases/download/v1.19.16/mihomo-darwin-arm64-go122-v1.19.16.gz

# 解压
gunzip mihomo-darwin-arm64-go122-v1.19.16.gz

# 创建软链接
sudo ln -sf /opt/clash/bin/mihomo-darwin-arm64-latest /opt/clash/bin/clash-target

# 验证软链接
ls -la /opt/clash/bin/clash-target

# 验证新版本
sudo -u _clash /opt/clash/bin/clash-target -v

# 设置正确的权限，确保二进制文件可执行
sudo chmod +x /opt/clash/bin/mihomo
sudo chmod +x /opt/clash/bin/clash-target

# 配置用户和分组
sudo chown root:wheel /opt/clash/bin/
sudo chown -R _clash:_clash /opt/clash/config/ /opt/clash/logs/
```

最终的目录结构如下

```markdown
/opt/clash/
├── bin/
│ ├── mihomo-darwin-arm64-go122-v1.19.16 # Mihomo 可执行文件
│ ├── bin # 自定义脚本
│ └── clash-target -> /opt/clash/bin/mihomo-darwin-arm64-go122-v1.19.16 # 软链接
├── config/
│ └── config.yaml # Clash 配置文件
└── logs/
├── clash.log # 标准输出日志
└── clash-error.log # 标准错误日
```

### 更新 mihomo 版本

```bash
# 下载最新版本的 mihomo
curl -L \
  -o mihomo-darwin-arm64-go122-v1.19.16.gz \
  https://github.com/MetaCubeX/mihomo/releases/download/v1.19.16/mihomo-darwin-arm64-go122-v1.19.16.gz

# 解压
gunzip mihomo-darwin-arm64-go122-v1.19.16.gz

# 创建软链接
sudo ln -sf /opt/clash/bin/mihomo-darwin-arm64-latest /opt/clash/bin/clash-target

# 验证软链接
ls -la /opt/clash/bin/clash-target

# 验证新版本
sudo -u _clash /opt/clash/bin/clash-target -v

# 重启 mihomo
clash restart
```

## mihomo 配置

参考官方的配置文件 [config.yaml](https://github.com/MetaCubeX/mihomo/blob/Meta/docs/config.yaml)

```bash
# 检查配置是否合法
sudo -u nobody /opt/clash/bin/clash-target -t -d /opt/clash/config/

# 配置加载过程中可能由于网络问题导致 geoip.dat geoip.metadb geosite.dat 下载失败，可以手动下载然后复制到 /opt/clash/config 目录下
# 或者尝试 设置 config.yaml 中的 ipv6: false 看是否能下载成功
```

## 自定义 clash 脚本

创建一个 clash 脚本能够快速执行一些命令管理 clash

```bash
touch /opt/clash/bin/clash
sudo chmod +x /opt/clash/bin/clash

# 添加到系统环境变量
export PATH="/opt/clash/bin:$PATH"

# 也可以使用短链接
sudo ln -s /opt/clash/bin/clash /usr/local/bin/clash
```

完整的脚本实现如下

```bash
#!/bin/zsh
set -euo pipefail

# Clash Management Script
# Location: /opt/clash/bin/clash
# This script provides comprehensive control for Mihomo/Clash running via launchd

CLASH_BIN="/opt/clash/bin/clash-target"
CONFIG_DIR="/opt/clash/config"
CONFIG_FILE="$CONFIG_DIR/config.yaml"
LOG_DIR="/opt/clash/logs"
LAUNCHD_PLIST="/Library/LaunchDaemons/com.user.clash.plist"

# 定义颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 基础函数
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查服务是否运行
is_service_running() {
    # 方法1（推荐）：直接检查是否有 clash-target 进程在运行
    if pgrep -f "clash-target" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# 检查启动项是否启用
is_launchd_enabled() {
    launchctl print system/com.user.clash &>/dev/null && return 0 || return 1
}

# 验证配置文件
validate_config() {
    local validation_result

    if [[ ! -f "$CLASH_BIN" ]]; then
        print_error "Clash binary not found: $CLASH_BIN"
        return 1
    fi

    if [[ ! -f "$CONFIG_FILE" ]]; then
        print_error "Config file not found: $CONFIG_FILE"
        return 1
    fi

    # 使用更明确的错误处理
    if validation_result=$(sudo -u nobody "$CLASH_BIN" -t -d "$CONFIG_DIR" 2>&1); then
        print_success "Configuration validation passed"
        return 0
    else
        print_error "Configuration validation failed: $validation_result"
        return 1
    fi
}

# 检查系统代理状态
is_system_proxy_enabled() {
    local http_proxy=$(networksetup -getwebproxy "Wi-Fi" | grep "Enabled: Yes")
    local https_proxy=$(networksetup -getsecurewebproxy "Wi-Fi" | grep "Enabled: Yes")

    if [[ -n "$http_proxy" && -n "$https_proxy" ]]; then
        return
    else
        return 1
    fi
}

# 主功能函数
clash_enable() {
    print_status "Enabling clash auto-start on boot..."
    if sudo launchctl load -w "$LAUNCHD_PLIST" 2>/dev/null; then
        print_success "Clash auto-start enabled"
    else
        print_error "Failed to enable auto-start"
    fi
}

clash_disable() {
    print_status "Disabling clash auto-start..."
    if sudo launchctl unload -w "$LAUNCHD_PLIST" 2>/dev/null; then
        print_success "Clash auto-start disabled"
    else
        print_error "Failed to disable auto-start"
    fi
}

clash_status() {
    echo "=== Clash Service Status ==="

    # 检查启动项状态
    if is_launchd_enabled; then
        echo -e "Auto-start: ${GREEN}Enabled${NC}"
    else
        echo -e "Auto-start: ${RED}Disabled${NC}"
    fi

    # 检查服务运行状态
    if is_service_running; then
        echo -e "Service: ${GREEN}Running${NC}"
    else
        echo -e "Service: ${RED}Stopped${NC}"
    fi

    # 检查系统代理状态
    if is_system_proxy_enabled; then
        echo -e "System Proxy: ${GREEN}Enabled${NC}"
    else
        echo -e "System Proxy: ${RED}Disabled${NC}"
    fi

    # 显示文件路径
    echo "Config Path: $CONFIG_FILE"
    echo "Log Path: $LOG_DIR"
    echo "Binary Path: $CLASH_BIN"

    # 显示最新日志
    if [[ -f "$LOG_DIR/clash.log" ]]; then
        echo -e "\n=== Recent Logs ==="
        tail -5 "$LOG_DIR/clash.log" 2>/dev/null || echo "No recent logs found"
    fi
}

clash_start() {
    if is_service_running; then
        print_warning "Clash is already running"
        return
    fi

    print_status "Starting clash service..."
    validate_config || return 1

    sudo launchctl start com.user.clash
    sleep 2

    if is_service_running; then
        print_success "Clash started successfully"
    else
        print_error "Failed to start clash"
    fi
}

clash_stop() {
    if ! is_service_running; then
        print_warning "Clash is not running"
        return
    fi

    print_status "Stopping clash service..."
    sudo launchctl stop com.user.clash

    sleep 2
    if ! is_service_running; then
        print_success "Clash stopped successfully"
    else
        print_error "Failed to stop clash"
    fi
}

clash_restart() {
    clash_stop
    clash_start
}

# 需要设置所有网络的代理才能让代理生效，实测仅设置 Wifi 的代理，虽然命令行能正常走代理但是浏览器还是无法使用
clash_on() {
    print_status "Enabling system proxy for all network services..."

    # 获取当前网络端口(从配置文件中提取)
    local proxy_port=$(grep -E "^mixed-port:" "$CONFIG_FILE" 2>/dev/null | awk '{print $2}')
    if [[ -z "$proxy_port" ]]; then
        proxy_port=7890  # 默认端口
    fi

    # 1. 获取所有网络服务列表
    # 使用 networksetup 命令列出所有服务，并过滤掉已禁用的服务(名称前带*号)
    local network_services
    network_services=$(networksetup -listallnetworkservices | tail -n +2 | grep -v '^\*')

    # 2. 遍历每个网络服务并设置代理
    echo "$network_services" | while read -r service; do
        # 跳过空行
        if [[ -z "$service" ]]; then
            continue
        fi

        print_status "Setting proxy for: $service"

        # 设置HTTP/HTTPS/SOCKS代理
        sudo networksetup -setwebproxy "$service" 127.0.0.1 "$proxy_port"
        sudo networksetup -setsecurewebproxy "$service" 127.0.0.1 "$proxy_port"
        sudo networksetup -setsocksfirewallproxy "$service" 127.0.0.1 "$proxy_port"

        # 启用代理
        sudo networksetup -setwebproxystate "$service" on
        sudo networksetup -setsecurewebproxystate "$service" on
        sudo networksetup -setsocksfirewallproxystate "$service" on
    done

    print_success "System proxy enabled on port $proxy_port for all network services"
}

clash_off() {
    print_status "Disabling system proxy for all network services..."

    # 获取所有网络服务列表
    local network_services
    network_services=$(networksetup -listallnetworkservices | tail -n +2 | grep -v '^\*')

    # 遍历每个网络服务并关闭代理
    echo "$network_services" | while read -r service; do
        # 跳过空行
        if [[ -z "$service" ]]; then
            continue
        fi

        print_status "Disabling proxy for: $service"

        sudo networksetup -setwebproxystate "$service" off
        sudo networksetup -setsecurewebproxystate "$service" off
        sudo networksetup -setsocksfirewallproxystate "$service" off
    done

    print_success "System proxy disabled for all network services"
}

clash_config_edit() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        print_error "Config file not found: $CONFIG_FILE"
        return 1
    fi

    # 备份原配置
    cp "$CONFIG_FILE" "$CONFIG_FILE.bak"
    print_status "Backup created: $CONFIG_FILE.bak"

    # 使用vim编辑
    vim "$CONFIG_FILE"

    # 验证编辑后的配置
    if validate_config; then
        print_success "Configuration updated and validated"
        # 询问是否重启服务
        read -q "REPLY?Restart clash to apply changes? (y/n): "
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            clash_restart
        fi
    else
        print_error "Configuration validation failed, restoring backup..."
        cp "$CONFIG_FILE.bak" "$CONFIG_FILE"
        return 1
    fi
}

clash_config_set() {
    local field="$1"
    local value="$2"

    if [[ -z "$field" || -z "$value" ]]; then
        print_error "Usage: clash config-set <field> <value>"
        return 1
    fi

    if [[ ! -f "$CONFIG_FILE" ]]; then
        print_error "Config file not found"
        return 1
    fi

    # 备份原配置
    cp "$CONFIG_FILE" "$CONFIG_FILE.bak"

    # 使用yq工具修改配置(需要先安装yq)
    if command -v yq >/dev/null 2>&1; then
        yq e ".$field = \"$value\"" -i "$CONFIG_FILE"
    else
        # 如果没有yq，使用sed简单替换（适用于简单字段）
        if grep -q "^$field:" "$CONFIG_FILE"; then
            sed -i.bak "s/^$field:.*/$field: $value/" "$CONFIG_FILE"
        else
            # 如果字段不存在，添加到文件末尾
            echo "$field: $value" >> "$CONFIG_FILE"
        fi
    fi

    # 验证配置
    if validate_config; then
        print_success "Configuration updated: $field = $value"
    else
        print_error "Configuration validation failed, restoring backup..."
        cp "$CONFIG_FILE.bak" "$CONFIG_FILE"
        return 1
    fi
}

# 模式设置函数
clash_mode_rule() { clash_config_set "mode" "rule" && clash_restart; }
clash_mode_global() { clash_config_set "mode" "global" && clash_restart; }
clash_mode_direct() { clash_config_set "mode" "direct" && clash_restart; }

# TUN模式设置函数
clash_tun_on() {
    clash_config_set "tun.enable" "true" && clash_restart;
}

clash_tun_off() {
    clash_config_set "tun.enable" "false" && clash_restart;
}

clash_validate() {
    print_status "Validating clash configuration..."

    # 检查二进制文件是否存在
    if [[ ! -f "$CLASH_BIN" ]]; then
        print_error "Clash binary not found: $CLASH_BIN"
        return 1
    fi

    # 检查配置文件是否存在
    if [[ ! -f "$CONFIG_FILE" ]]; then
        print_error "Config file not found: $CONFIG_FILE"
        return 1
    fi

    # 检查配置文件语法
    echo "=== Configuration Syntax Check ==="
    if validation_result=$(sudo -u nobody "$CLASH_BIN" -t -d "$CONFIG_DIR" 2>&1); then
        print_success "✓ Configuration syntax is valid"
    else
        print_error "✗ Configuration syntax error:"
        echo "$validation_result"
        return 1
    fi

    # 检查关键配置项
    echo -e "\n=== Key Configuration Items ==="

    # 检查端口配置
    local mixed_port=$(grep -E "^mixed-port:" "$CONFIG_FILE" 2>/dev/null | awk '{print $2}')
    local socks_port=$(grep -E "^socks-port:" "$CONFIG_FILE" 2>/dev/null | awk '{print $2}')
    local external_port=$(grep -E "^external-controller:" "$CONFIG_FILE" 2>/dev/null | awk -F: '{print $3}')

    echo -e "Mixed Port: ${mixed_port:-7890 (default)}"
    echo -e "SOCKS Port: ${socks_port:-Not set}"
    echo -e "External Controller: ${external_port:-9090 (default)}"

    # 检查模式设置
    local mode=$(grep -E "^mode:" "$CONFIG_FILE" 2>/dev/null | awk '{print $2}')
    echo -e "Mode: ${mode:-rule (default)}"

    # 检查代理组和规则
    echo -e "\n=== Proxies and Rules ==="
    # 统计 proxies 下的节点数量
    local proxy_count=$(yq e '.proxies | length' "$CONFIG_FILE" 2>/dev/null || echo "0")

    # 统计 rules 下的规则数量
    local rule_count=$(yq e '.rules | length' "$CONFIG_FILE" 2>/dev/null || echo "0")

    echo -e "Proxy count: $proxy_count"
    echo -e "Rule count: $rule_count"

    # 检查DNS配置
    local dns_enabled=$(grep -A5 "^dns:" "$CONFIG_FILE" 2>/dev/null | grep -q "enable: true" && echo "Enabled" || echo "Disabled")
    echo -e "DNS: $dns_enabled"

    # 检查TUN配置
    local tun_enabled=$(grep -A5 "^tun:" "$CONFIG_FILE" 2>/dev/null | grep -q "enable: true" && echo "Enabled" || echo "Disabled")
    echo -e "TUN: $tun_enabled"

    # 检查文件权限
    echo -e "\n=== File Permissions ==="
    if [[ -r "$CONFIG_FILE" ]]; then
        print_success "✓ Config file is readable"
    else
        print_error "✗ Config file is not readable"
    fi

    if [[ -x "$CLASH_BIN" ]]; then
        print_success "✓ Binary file is executable"
    else
        print_error "✗ Binary file is not executable"
    fi

    # 检查端口占用情况
    echo -e "\n=== Port Availability ==="
    if [[ -n "$mixed_port" ]]; then
        if sudo lsof -i :$mixed_port >/dev/null 2>&1; then
            print_warning "⚠ Port $mixed_port is already in use"
        else
            print_success "✓ Port $mixed_port is available"
        fi
    fi

    if [[ -n "$external_port" ]]; then
        if sudo lsof -i :$external_port >/dev/null 2>&1; then
            print_warning "⚠ External port $external_port is already in use"
        else
            print_success "✓ External port $external_port is available"
        fi
    fi

    # 最终验证结果 - 修复后的逻辑
    echo -e "\n=== Final Validation Result ==="
    if sudo -u nobody "$CLASH_BIN" -t -d "$CONFIG_DIR" >/dev/null 2>&1; then
        print_success "🎉 Configuration validation passed! All checks are good."
        return 0
    else
        print_error "❌ Configuration validation failed. Please check the errors above."
        return 1
    fi
}

# 主命令解析
case "$1" in
    "enable")
        clash_enable
        ;;
    "disable")
        clash_disable
        ;;
    "status")
        clash_status
        ;;
    "start")
        clash_start
        ;;
    "stop")
        clash_stop
        ;;
    "restart")
        clash_restart
        ;;
    "on")
        clash_on
        ;;
    "off")
        clash_off
        ;;
    "valid")
        clash_validate
        ;;
    "config-edit")
        clash_config_edit
        ;;
    "config-set")
        clash_config_set "$2" "$3"
        ;;
    "mode-rule")
        clash_mode_rule
        ;;
    "mode-global")
        clash_mode_global
        ;;
    "mode-direct")
        clash_mode_direct
        ;;
    "tun-on")
        clash_tun_on
        ;;
    "tun-off")
        clash_tun_off
        ;;
    *)
        echo "Clash Management Script"
        echo "Usage: clash {enable|disable|status|start|stop|restart|on|off|config-edit|config-set|mode-rule|mode-global|mode-direct|tun-on|tun-off}"
        echo ""
        echo "Commands:"
        echo "  enable        Enable auto-start on boot"
        echo "  disable       Disable auto-start"
        echo "  status        Show service status and information"
        echo "  start         Start clash service"
        echo "  stop          Stop clash service"
        echo "  restart       Restart clash service"
        echo "  on            Enable system proxy"
        echo "  off           Disable system proxy"
        echo "  valid      Validate configuration file and check for issues"
        echo "  config-edit   Edit configuration with vim"
        echo "  config-set    <field> <value>  Set specific configuration field"
        echo "  mode-rule     Set mode to Rule and restart"
        echo "  mode-global   Set mode to Global and restart"
        echo "  mode-direct   Set mode to Direct and restart"
        echo "  tun-on        Enable TUN mode and restart"
        echo "  tun-off       Disable TUN mode and restart"
        exit 1
        ;;
esac
```

可以使用 clash -h 命令查看用法

```markdown
Clash Management Script
Usage: clash {enable|disable|status|start|stop|restart|on|off|config-edit|config-set|mode-rule|mode-global|mode-direct|tun-on|tun-off}

Commands:
enable Enable auto-start on boot
disable Disable auto-start
status Show service status and information
start Start clash service
stop Stop clash service
restart Restart clash service
on Enable system proxy
off Disable system proxy
valid Validate configuration file and check for issues
config-edit Edit configuration with vim
config-set <field> <value> Set specific configuration field
mode-rule Set mode to Rule and restart
mode-global Set mode to Global and restart
mode-direct Set mode to Direct and restart
tun-on Enable TUN mode and restart
tun-off Disable TUN mode and restart
```

## launchd 配置

需要创建一个系统级的 plist 来管理 clash 的开机启动

```bash
sudo touch com.user.clash.plist
```

plist 具体内容如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.clash</string>

    <!-- 传递给程序的参数：-d 指定配置目录 -->
    <key>ProgramArguments</key>
    <array>
        <string>/opt/clash/bin/clash-target</string>
        <string>-d</string>
        <string>/opt/clash/config</string>
    </array>

    <!-- 核心修改：指定运行身份为 _clash 用户和组 -->
    <key>UserName</key>
    <string>_clash</string>
    <key>GroupName</key>
    <string>_clash</string>

    <!-- 设置工作目录 -->
    <key>WorkingDirectory</key>
    <string>/opt/clash</string>

    <!-- 在加载服务时立即启动 -->
    <key>RunAtLoad</key>
    <true/>

    <!-- 配置基于网络状态的保活 -->
    <key>KeepAlive</key>
    <dict>
        <key>NetworkState</key>
        <true/>
    </dict>

    <!-- 标准输出和错误输出到日志文件 -->
    <key>StandardOutPath</key>
    <string>/opt/clash/logs/clash.log</string>
    <key>StandardErrorPath</key>
    <string>/opt/clash/logs/clash-error.log</string>

    <!-- 关于 LimitLoadToSessionType 的解释见下文 -->
    <key>LimitLoadToSessionType</key>
    <array>
        <string>System</string>
        <!-- 对于需要与任意用户图形会话交互的图形界面程序，可考虑添加 "Aqua" -->
        <!-- 但对于 Mihomo 这种网络代理守护进程，通常只使用 "System" -->
    </array>
</dict>
</plist>
```

```bash
# 1. 将 plist 文件复制到系统守护进程目录
sudo cp com.user.clash.plist /Library/LaunchDaemons/

# 2. 确保文件权限正确（root 用户和 wheel 组拥有所有权）
sudo chown root:wheel /Library/LaunchDaemons/com.user.mihomo.plist
sudo chmod 644 /Library/LaunchDaemons/com.user.mihomo.plist # 通常plist文件权限为644

# 3. 确保 /opt/clash 目录及其下文件对运行用户（nobody）有适当的访问权限
# 一种简单的方式是将配置目录的读权限赋予其他用户，但更安全的方法是更改文件所有者或设置更精细的ACL
sudo chmod o+r /opt/clash/config/config.yaml # 让其他用户能读配置（如果配置不含敏感信息）

# 4. 加载服务配置使其生效
sudo launchctl load -w /Library/LaunchDaemons/com.user.mihomo.plist

# 5. 如果服务没有因 RunAtLoad 而自动启动，或者您想立即启动它，可以使用：
sudo launchctl start com.user.mihomo

# 如果使用上面的 /bin/clash 命令
clash enable # 设置开机启动并立即启动
clash on # 设为系统代理
```

还需要用一个用户级的 plist 自动启动设置系统代理，否则每次重启后都需要重新运行 `clash on` 来开启系统代理

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.clash-on</string>

    <key>ProgramArguments</key>
    <array>
        <string>/opt/clash/bin/clash</string>  <!-- 使用绝对路径 -->
        <string>on</string>
    </array>

    <!-- 登录时自动执行 -->
    <key>RunAtLoad</key>
    <true/>

    <!-- 登录 15 秒后执行 clash on -->
    <key>StartDelay</key>
    <integer>5</integer>

    <!-- 只在图形界面会话中运行 -->
    <key>LimitLoadToSessionType</key>
    <array>
        <string>Aqua</string>
    </array>

    <!-- 可选：日志输出 -->
    <key>StandardOutPath</key>
    <string>/tmp/clash-on.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/clash-on-error.log</string>
</dict>
</plist>
```

```bash
sudo touch com.user.clash-on.plist

sudo cp com.user.clash-on.plist ~/Library/LaunchAgents/

chown $(whoami):staff ~/Library/LaunchAgents/com.user.clash-on.plist

# 运行，不要使用 sudo 会切换到 root
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.user.clash-on.plist
launchctl enable gui/$UID/com.user.clash-on

# 卸载 禁用
launchctl bootout gui/$UID ~/Library/LaunchAgents/com.user.clash-on.plist
launchctl disable gui/$UID/com.user.clash-on

```
