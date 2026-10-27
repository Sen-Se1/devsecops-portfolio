Vagrant.configure("2") do |config|
  # --------------------------------------------------
  # 1. VM Configuration
  # --------------------------------------------------
  config.vm.box = "generic/ubuntu2204"
  config.vm.hostname = "ubuntu-target"

  # --------------------------------------------------
  # 2. Port Forwarding
  # --------------------------------------------------
  # Frontend: Next.js
  config.vm.network "forwarded_port",
    guest: 3000,
    host: 3000,
    host_ip: "127.0.0.1"

  # Backend: Express API
  config.vm.network "forwarded_port",
    guest: 4000,
    host: 4000,
    host_ip: "127.0.0.1"

  # --------------------------------------------------
  # 3. Libvirt Provider
  # --------------------------------------------------
  config.vm.provider "libvirt" do |v|
    v.memory = 4096
    v.cpus = 2
  end

  # --------------------------------------------------
  # 4. Configure DNS inside the VM
  # --------------------------------------------------
  config.vm.provision "shell", inline: <<-SHELL
    set -e

    # Create a persistent systemd service for DNS
    cat > /etc/systemd/system/vagrant-dns.service <<'EOF'
[Unit]
Description=Configure DNS for the Vagrant guest
After=systemd-resolved.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/bin/resolvectl dns eth0 1.1.1.1 8.8.8.8
ExecStart=/usr/bin/resolvectl domain eth0 ~.
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

    # Enable and start the service
    systemctl daemon-reload
    systemctl enable --now vagrant-dns.service

    # Wait for DNS resolution
    echo "Checking DNS resolution..."

    for i in $(seq 1 10); do
      if getent hosts archive.ubuntu.com >/dev/null 2>&1; then
        echo "DNS resolution is working."
        exit 0
      fi

      sleep 2
    done

    echo "ERROR: DNS resolution is still failing."
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