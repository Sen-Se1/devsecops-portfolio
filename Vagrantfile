Vagrant.configure("2") do |config|

  config.vm.box = "generic/ubuntu2204"

  config.vm.hostname = "devsecops-vm"

  config.vm.provider :libvirt do |libvirt|
    libvirt.memory = 2048
    libvirt.cpus = 1
  end

end