Vagrant.configure("2") do |config|
  # --------------------------------------------------
  # 1. VM Configuration
  # --------------------------------------------------
  config.vm.box = "generic/ubuntu2204"
  config.vm.hostname = "ubuntu-target"

  # --------------------------------------------------
  # 2. Port Forwarding
  # --------------------------------------------------
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 4000, host: 4000

  # --------------------------------------------------
  # 3. Libvirt Provider
  # --------------------------------------------------
  config.vm.provider "libvirt" do |v|
    v.memory = 4096
    v.cpus = 2
  end

  # --------------------------------------------------
  # 4. Configure persistent DNS inside the VM
  # --------------------------------------------------
  config.vm.provision "shell", inline: <<-SHELL
    set -e

    mkdir -p /etc/systemd/resolved.conf.d

    cat > /etc/systemd/resolved.conf.d/99-vagrant-dns.conf <<'EOF'
[Resolve]
DNS=1.1.1.1 8.8.8.8
FallbackDNS=9.9.9.9
Domains=~.
DNSSEC=no
EOF

    # Reload the DNS resolver with the new configuration
    systemctl restart systemd-resolved

    # Explicitly apply DNS servers to the guest interface
    resolvectl dns eth0 1.1.1.1 8.8.8.8
    resolvectl domain eth0 '~.'

    # Clear cached DNS results
    resolvectl flush-caches

    echo "Checking DNS resolution..."

    for i in $(seq 1 15); do
      if getent hosts archive.ubuntu.com >/dev/null 2>&1; then
        echo "DNS resolution is working."
        exit 0
      fi
      sleep 2
    done

    echo "ERROR: DNS resolution is still failing."
    resolvectl status
    exit 1
  SHELL

  # --------------------------------------------------
  # 5. Ansible Provisioning
  # --------------------------------------------------
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/playbooks/deploy-portfolio.yml"

    # Match the group targeted by the deployment playbook
    ansible.groups = {
      "portfolio_servers" => ["default"]
    }

    ansible.become = true
    ansible.verbose = "v"
  end
end