Vagrant.configure("2") do |config|

  config.vm.box = "generic/ubuntu2204"

  config.vm.hostname = "devsecops-vm-update"

  config.vm.network "private_network", ip: "192.168.121.100"

  config.vm.provider :libvirt do |libvirt|
    libvirt.memory = 3072
    libvirt.cpus = 2
  end

end